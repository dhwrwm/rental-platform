import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PricingService } from '../common/pricing/pricing.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { AvailabilityStatus, BookingStatus, Prisma } from '../generated/prisma';
import { CreateBookingDto } from './dto/create-booking-dto';
import { QuoteBookingDto } from './dto/quote-booking.dto';

const bookingSelect = {
  id: true,
  listingId: true,
  renterId: true,
  checkIn: true,
  checkOut: true,
  totalPrice: true,
  guestsCount: true,
  createdAt: true,
  updatedAt: true,
  cancelledAt: true,
  bookedAt: true,
  listing: {
    select: {
      id: true,
      title: true,
    },
  },
  renter: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  bookingPrice: {
    select: {
      basePrice: true,
      cleaningFee: true,
      serviceFee: true,
      otherFees: true,
      securityDepositPercentage: true,
      taxes: true,
      discount: true,
      totalPrice: true,
      priceBreakdown: true,
    },
  },
} as const;

@Injectable()
export class BookingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pricingService: PricingService,
  ) {}

  async create(dto: CreateBookingDto) {
    const quote = await this.pricingService.quoteBooking(dto);

    await this.ensureRenterExists(dto.renterId);

    return this.prismaService.client.$transaction(async (tx) => {
      // 1. Validate availability.
      await this.ensureListingIsAvailable(
        tx,
        dto.listingId,
        quote.checkIn,
        quote.checkOut,
      );

      const bookingId = randomUUID();

      // 2. Create booking.
      // 3. Create booking price snapshot.
      const booking = await tx.booking.create({
        data: {
          id: bookingId,
          listing: {
            connect: { id: dto.listingId },
          },
          renter: {
            connect: { id: dto.renterId },
          },
          checkIn: quote.checkIn,
          checkOut: quote.checkOut,
          guestsCount: dto.guestsCount,
          totalPrice: Math.round(quote.totalPrice),
          bookingPrice: {
            create: {
              bookingId,
              checkIn: quote.checkIn,
              checkOut: quote.checkOut,
              basePrice: quote.nightlySubtotal,
              securityDepositPercentage: quote.securityDeposit.percentage,
              cleaningFee: quote.fees.cleaningFee,
              serviceFee: quote.fees.serviceFee,
              otherFees: quote.fees.otherFees,
              taxes: quote.taxes.total,
              discount: 0,
              totalPrice: quote.totalPrice,
              priceBreakdown: quote.priceBreakdown,
            },
          },
        },
        select: bookingSelect,
      });

      // 4. Mark listing availability as booked for this stay.
      await tx.listingAvailability.create({
        data: {
          listingId: dto.listingId,
          fromDate: quote.checkIn,
          toDate: quote.checkOut,
          availabilityStatus: AvailabilityStatus.BOOKED,
        },
        select: { id: true },
      });

      // 5. TODO: Create the payment intent before confirming the booking.
      // TODO: Generate the lease document and attach it to this booking.
      // TODO: Notify renter, owner, and assigned agent after booking creation.
      return booking;
    });
  }

  async quote(dto: QuoteBookingDto) {
    return this.pricingService.quoteBooking(dto);
  }

  async findAll() {
    return this.prismaService.client.booking.findMany({
      select: bookingSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async ensureRenterExists(renterId: string) {
    const renter = await this.prismaService.client.user.findUnique({
      where: { id: renterId },
      select: { id: true },
    });

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    return renter;
  }

  private async ensureListingIsAvailable(
    tx: Prisma.TransactionClient,
    listingId: string,
    checkIn: Date,
    checkOut: Date,
  ) {
    const booking = await tx.booking.findFirst({
      where: {
        listingId,
        status: {
          not: BookingStatus.CANCELLED,
        },
        checkIn: {
          lt: checkOut,
        },
        checkOut: {
          gt: checkIn,
        },
      },
      select: { id: true },
    });

    if (booking) {
      throw new ConflictException('Listing is already booked for these dates');
    }

    const availability = await tx.listingAvailability.findFirst({
      where: {
        listingId,
        availabilityStatus: {
          not: AvailabilityStatus.AVAILABLE,
        },
        fromDate: {
          lt: checkOut,
        },
        toDate: {
          gt: checkIn,
        },
      },
      select: { id: true },
    });

    if (availability) {
      throw new ConflictException('Listing is unavailable for these dates');
    }
  }
}
