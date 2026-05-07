import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

const rateSelect = {
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

    return this.prismaService.client.listingRate.findMany({
      where: { listingId },
      select: rateSelect,
      orderBy: {
        fromDate: 'asc',
      },
    });
  }

  async findById(listingId: string, rateId: string) {
    return this.findRate(listingId, rateId);
  }

  async create(listingId: string, dto: CreateRateDto) {
    await this.ensureListingExists(listingId);
    this.ensureValidDateRange(dto.fromDate, dto.toDate);

    return this.prismaService.client.listingRate.create({
      data: {
        fromDate: dto.fromDate,
        toDate: dto.toDate,
        price: dto.price,
        note: dto.note,
        listingId,
      },
      select: rateSelect,
    });
  }

  async update(listingId: string, rateId: string, dto: UpdateRateDto) {
    const rate = await this.findRate(listingId, rateId);
    const fromDate = dto.fromDate ?? rate.fromDate.toISOString();
    const toDate = dto.toDate ?? rate.toDate.toISOString();

    this.ensureValidDateRange(fromDate, toDate);

    return this.prismaService.client.listingRate.update({
      where: { id: rateId },
      data: {
        fromDate: dto.fromDate,
        toDate: dto.toDate,
        price: dto.price,
        note: dto.note,
      },
      select: rateSelect,
    });
  }

  async remove(listingId: string, rateId: string) {
    await this.findRate(listingId, rateId);

    await this.prismaService.client.listingRate.delete({
      where: { id: rateId },
    });

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
    const rate = await this.prismaService.client.listingRate.findFirst({
      where: {
        id: rateId,
        listingId,
      },
      select: rateSelect,
    });

    if (!rate) {
      throw new NotFoundException('Listing rate not found');
    }

    return rate;
  }

  private ensureValidDateRange(fromDate: string, toDate: string) {
    if (new Date(fromDate) >= new Date(toDate)) {
      throw new BadRequestException('fromDate must be before toDate');
    }
  }
}
