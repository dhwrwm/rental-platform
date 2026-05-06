import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
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
    this.ensureValidDateRange(dto.fromDate, dto.toDate);

    return this.prismaService.client.listingAvailability.create({
      data: {
        fromDate: dto.fromDate,
        toDate: dto.toDate,
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

    this.ensureValidDateRange(fromDate, toDate);

    return this.prismaService.client.listingAvailability.update({
      where: { id: availabilityId },
      data: {
        fromDate: dto.fromDate,
        toDate: dto.toDate,
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

  private ensureValidDateRange(fromDate: string, toDate: string) {
    if (new Date(fromDate) >= new Date(toDate)) {
      throw new BadRequestException('fromDate must be before toDate');
    }
  }
}
