import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toUtcDate } from '../common/date/to-utc-date';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { QuoteRateDto } from './dto/quote-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

const rateSelect = {
  id: true,
  date: true,
  nightlyRate: true,
  note: true,
  listingId: true,
  createdAt: true,
  updatedAt: true,
  overriddenAt: true,
} as const;

const rateBatchSelect = {
  id: true,
  fromDate: true,
  toDate: true,
  price: true,
  note: true,
  listingId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ListingRatesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(listingId: string) {
    await this.ensureListingExists(listingId);

    return this.prismaService.client.listingRateBatch.findMany({
      where: { listingId },
      select: rateBatchSelect,
      orderBy: {
        fromDate: 'asc',
      },
    });
  }

  async findById(listingId: string, rateId: string) {
    return this.findRate(listingId, rateId);
  }

  async quote(listingId: string, dto: QuoteRateDto) {
    const range = this.parseDateRange(dto.checkIn, dto.checkOut);

    const listing = await this.prismaService.client.listing.findUnique({
      where: { id: listingId },
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

    const nights = this.eachDateInRange(range.fromDate, range.toDate);
    const ratesByDate = new Map(
      listing.rates.map((rate) => [this.toDateKey(rate.date), rate]),
    );
    const nightlyRates = nights.map((date) => {
      const rate = ratesByDate.get(this.toDateKey(date));

      return {
        date: date.toISOString(),
        nightlyRate: rate?.nightlyRate ?? listing.basePrice,
        source: rate ? 'CUSTOM' : 'BASE',
      };
    });
    const nightlySubtotal = nightlyRates.reduce(
      (total, rate) => total + rate.nightlyRate,
      0,
    );
    const cleaningFee = listing.cleaningFee ?? 0;
    const serviceFee = listing.serviceFee ?? 0;
    const otherFees = listing.otherFees ?? 0;
    const feesTotal = cleaningFee + serviceFee + otherFees;
    const securityDepositPercentage = listing.securityDepositPercentage ?? 0;
    const securityDeposit = (nightlySubtotal * securityDepositPercentage) / 100;
    const taxableAmount = nightlySubtotal + feesTotal;
    const taxPercentage = dto.taxPercentage ?? 0;
    const taxes = (taxableAmount * taxPercentage) / 100;
    const totalPrice = taxableAmount + taxes + securityDeposit;

    return {
      listingId: listing.id,
      checkIn: range.fromDate,
      checkOut: range.toDate,
      nights: nights.length,
      nightlySubtotal,
      fees: {
        cleaningFee,
        serviceFee,
        otherFees,
        total: feesTotal,
      },
      securityDeposit: {
        percentage: securityDepositPercentage,
        amount: securityDeposit,
      },
      taxes: {
        percentage: taxPercentage,
        amount: taxes,
      },
      totalPrice,
      priceBreakdown: {
        nightlyRates,
      },
    };
  }

  async create(listingId: string, dto: CreateRateDto) {
    console.log({ listingId, dto });
    await this.ensureListingExists(listingId);
    const range = this.parseDateRange(dto.fromDate, dto.toDate);

    return this.prismaService.client.$transaction(async (tx) => {
      const batch = await tx.listingRateBatch.create({
        data: {
          fromDate: range.fromDate,
          toDate: range.toDate,
          price: dto.price,
          note: dto.note,
          listingId,
        },
        select: rateBatchSelect,
      });

      const dailyRates = await Promise.all(
        this.eachDateInRange(range.fromDate, range.toDate).map((date) =>
          tx.listingRate.upsert({
            where: {
              listingId_date: {
                listingId,
                date,
              },
            },
            create: {
              date,
              nightlyRate: dto.price,
              note: dto.note,
              listingId,
            },
            update: {
              nightlyRate: dto.price,
              note: dto.note,
              overriddenAt: new Date(),
            },
            select: rateSelect,
          }),
        ),
      );

      return {
        ...batch,
        dailyRates,
      };
    });
  }

  async update(listingId: string, rateId: string, dto: UpdateRateDto) {
    const rate = await this.findRate(listingId, rateId);
    const range = this.parseDateRange(
      dto.fromDate ?? rate.fromDate.toISOString(),
      dto.toDate ?? rate.toDate.toISOString(),
    );
    const price = dto.price ?? rate.price;
    const note = Object.prototype.hasOwnProperty.call(dto, 'note')
      ? dto.note
      : rate.note;

    return this.prismaService.client.$transaction(async (tx) => {
      await tx.listingRate.deleteMany({
        where: {
          listingId,
          date: {
            gte: rate.fromDate,
            lt: rate.toDate,
          },
        },
      });

      const batch = await tx.listingRateBatch.update({
        where: { id: rateId },
        data: {
          fromDate: range.fromDate,
          toDate: range.toDate,
          price,
          note,
        },
        select: rateBatchSelect,
      });

      const dailyRates = await Promise.all(
        this.eachDateInRange(range.fromDate, range.toDate).map((date) =>
          tx.listingRate.upsert({
            where: {
              listingId_date: {
                listingId,
                date,
              },
            },
            create: {
              date,
              nightlyRate: price,
              note,
              listingId,
            },
            update: {
              nightlyRate: price,
              note,
              overriddenAt: new Date(),
            },
            select: rateSelect,
          }),
        ),
      );

      return {
        ...batch,
        dailyRates,
      };
    });
  }

  async remove(listingId: string, rateId: string) {
    const rate = await this.findRate(listingId, rateId);

    await this.prismaService.client.$transaction([
      this.prismaService.client.listingRate.deleteMany({
        where: {
          listingId,
          date: {
            gte: rate.fromDate,
            lt: rate.toDate,
          },
        },
      }),
      this.prismaService.client.listingRateBatch.delete({
        where: { id: rateId },
      }),
    ]);

    return {
      success: true,
    };
  }

  private async ensureListingExists(listingId: string) {
    const listing = await this.prismaService.client.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  private async findRate(listingId: string, rateId: string) {
    const rate = await this.prismaService.client.listingRateBatch.findFirst({
      where: {
        id: rateId,
        listingId,
      },
      select: rateBatchSelect,
    });

    if (!rate) {
      throw new NotFoundException('Listing rate batch not found');
    }

    return rate;
  }

  private parseDateRange(fromDate: string, toDate: string) {
    const parsedFromDate = toUtcDate(fromDate);
    const parsedToDate = toUtcDate(toDate);

    if (parsedFromDate >= parsedToDate) {
      throw new BadRequestException('fromDate must be before toDate');
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

  private toDateKey(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
