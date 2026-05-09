import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toUtcDate } from '../common/date/to-utc-date';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

const availabilitySelect = {
  id: true,
  fromDate: true,
  toDate: true,
  availabilityStatus: true,
  listingId: true,
} as const;

@Injectable()
export class ListingAvailabilityService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(listingId: string) {
    await this.ensureListingExists(listingId);

    return this.prismaService.client.listingAvailability.findMany({
      where: { listingId },
      select: availabilitySelect,
      orderBy: {
        fromDate: 'asc',
      },
    });
  }

  async findById(listingId: string, availabilityId: string) {
    const availability = await this.findAvailability(listingId, availabilityId);

    return availability;
  }

  async create(listingId: string, dto: CreateAvailabilityDto) {
    await this.ensureListingExists(listingId);
    const range = this.parseDateRange(dto.fromDate, dto.toDate);

    return this.prismaService.client.listingAvailability.create({
      data: {
        fromDate: range.fromDate,
        toDate: range.toDate,
        availabilityStatus: dto.availabilityStatus,
        listingId,
      },
      select: availabilitySelect,
    });
  }

  async update(
    listingId: string,
    availabilityId: string,
    dto: UpdateAvailabilityDto,
  ) {
    const availability = await this.findAvailability(listingId, availabilityId);
    const fromDate = dto.fromDate ?? availability.fromDate;
    const toDate = dto.toDate ?? availability.toDate;
    const range = this.parseDateRange(fromDate, toDate);

    return this.prismaService.client.listingAvailability.update({
      where: { id: availabilityId },
      data: {
        fromDate: dto.fromDate === undefined ? undefined : range.fromDate,
        toDate: dto.toDate === undefined ? undefined : range.toDate,
        availabilityStatus: dto.availabilityStatus,
      },
      select: availabilitySelect,
    });
  }

  async remove(listingId: string, availabilityId: string) {
    await this.findAvailability(listingId, availabilityId);

    await this.prismaService.client.listingAvailability.delete({
      where: { id: availabilityId },
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

  private async findAvailability(listingId: string, availabilityId: string) {
    const availability =
      await this.prismaService.client.listingAvailability.findFirst({
        where: {
          id: availabilityId,
          listingId,
        },
        select: availabilitySelect,
      });

    if (!availability) {
      throw new NotFoundException('Listing availability not found');
    }

    return availability;
  }

  private parseDateRange(fromDate: string | Date, toDate: string | Date) {
    const parsedFromDate = toUtcDate(fromDate);
    const parsedToDate = toUtcDate(toDate);

    if (parsedFromDate >= parsedToDate) {
      throw new BadRequestException('fromDate must be before toDate');
    }

    return {
      fromDate: parsedFromDate.toISOString(),
      toDate: parsedToDate.toISOString(),
    };
  }
}
