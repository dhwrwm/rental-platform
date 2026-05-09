import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toUtcDate } from '../date/to-utc-date';
import { PrismaService } from '../prisma/prisma.service';
import { calculateBookingPrice } from './booking-price';

type QuoteBookingInput = {
  listingId: string;
  checkIn: string;
  checkOut: string;
};

@Injectable()
export class PricingService {
  constructor(private readonly prismaService: PrismaService) {}

  async quoteBooking(input: QuoteBookingInput) {
    const range = this.parseDateRange(input.checkIn, input.checkOut);

    const listing = await this.prismaService.client.listing.findUnique({
      where: { id: input.listingId },
      select: {
        id: true,
        basePrice: true,
        securityDepositPercentage: true,
        cleaningFee: true,
        serviceFee: true,
        otherFees: true,
        rates: {
          where: {
            date: {
              gte: range.fromDate,
              lt: range.toDate,
            },
          },
          select: {
            date: true,
            nightlyRate: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return calculateBookingPrice({
      listingId: listing.id,
      checkIn: range.fromDate,
      checkOut: range.toDate,
      nights: this.eachDateInRange(range.fromDate, range.toDate),
      basePrice: listing.basePrice,
      securityDepositPercentage: listing.securityDepositPercentage,
      cleaningFee: listing.cleaningFee,
      serviceFee: listing.serviceFee,
      otherFees: listing.otherFees,
      rates: listing.rates,
    });
  }

  private parseDateRange(fromDate: string, toDate: string) {
    const parsedFromDate = toUtcDate(fromDate);
    const parsedToDate = toUtcDate(toDate);

    if (parsedFromDate >= parsedToDate) {
      throw new BadRequestException('checkIn must be before checkOut');
    }

    return {
      fromDate: parsedFromDate,
      toDate: parsedToDate,
    };
  }

  private eachDateInRange(fromDate: Date, toDate: Date) {
    const dates: Date[] = [];
    let currentDate = new Date(fromDate);

    while (currentDate < toDate) {
      dates.push(new Date(currentDate));
      currentDate = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate() + 1,
        ),
      );
    }

    return dates;
  }
}
