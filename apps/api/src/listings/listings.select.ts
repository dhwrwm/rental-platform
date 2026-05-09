import { Prisma } from '../generated/prisma';

export const listingSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  longitude: true,
  latitude: true,
  address: true,
  city: true,
  state: true,
  country: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  rooms: true,
  bedrooms: true,
  bathrooms: true,
  capacity: true,
  amenities: true,
  checkingInTime: true,
  checkingOutTime: true,
  basePrice: true,
  securityDepositPercentage: true,
  cleaningFee: true,
  serviceFee: true,
  otherFees: true,
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      order: true,
    },
    orderBy: {
      order: 'asc',
    },
  },
  availabilities: {
    select: {
      id: true,
      fromDate: true,
      toDate: true,
      availabilityStatus: true,
    },
    orderBy: {
      fromDate: 'asc',
    },
  },
  rates: {
    select: {
      id: true,
      date: true,
      nightlyRate: true,
      note: true,
      overriddenAt: true,
    },
    orderBy: {
      date: 'asc',
    },
  },
  rateBatches: {
    select: {
      id: true,
      fromDate: true,
      toDate: true,
      price: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      fromDate: 'asc',
    },
  },
  _count: {
    select: {
      bookings: true,
    },
  },
} as const;

export type ListingWithRelations = Prisma.ListingGetPayload<{
  select: typeof listingSelect;
}>;
