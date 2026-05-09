import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Role } from '../generated/prisma';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { listingSelect, ListingWithRelations } from './listings.select';

@Injectable()
export class ListingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const listings = await this.prismaService.client.listing.findMany({
      select: listingSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listings.map((listing) => this.formatListing(listing));
  }

  async findById(id: string) {
    const listing = await this.prismaService.client.listing.findUnique({
      where: { id },
      select: listingSelect,
    });

    if (!listing) {
      throw new NotFoundException(`Listing ${id} was not found`);
    }

    return this.formatListing(listing);
  }

  async create(dto: CreateListingDto) {
    await this.ensureOwnerExists(dto.ownerId);

    const slug = await this.generateUniqueSlug(dto.title, dto.address);

    const listing = await this.prismaService.client.listing.create({
      data: {
        ...dto,
        slug,
      },
      select: listingSelect,
    });

    return this.formatListing(listing);
  }

  async update(id: string, dto: UpdateListingDto) {
    await this.ensureListingExists(id);

    if (dto.ownerId) {
      await this.ensureOwnerExists(dto.ownerId);
    }

    const listing = await this.prismaService.client.listing.update({
      where: { id },
      data: dto,
      select: listingSelect,
    });

    return this.formatListing(listing);
  }

  async remove(id: string) {
    await this.ensureListingExists(id);

    await this.prismaService.client.listing.delete({
      where: { id },
    });

    return {
      success: true,
    };
  }

  private formatListing(listing: ListingWithRelations) {
    const { _count, ...rest } = listing;

    return {
      ...rest,
      counts: _count,
    };
  }

  private async ensureListingExists(id: string) {
    const listing = await this.prismaService.client.listing.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  private async ensureOwnerExists(ownerId: string) {
    const owner = await this.prismaService.client.user.findFirst({
      where: {
        id: ownerId,
        role: {
          in: [Role.ADMIN, Role.AGENT, Role.HOMEOWNER],
        },
      },
      select: { id: true },
    });

    if (!owner) {
      throw new NotFoundException('Listing owner not found');
    }

    return owner;
  }

  private async generateUniqueSlug(title: string, address: string) {
    const baseSlug = this.slugify(`${title} ${address}`);
    let slug = baseSlug;
    let suffix = 2;

    while (await this.slugExists(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private slugify(value: string) {
    return (
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'listing'
    );
  }

  private async slugExists(slug: string) {
    const listing = await this.prismaService.client.listing.findUnique({
      where: {
        slug,
      },
      select: { id: true },
    });

    return Boolean(listing);
  }
}
