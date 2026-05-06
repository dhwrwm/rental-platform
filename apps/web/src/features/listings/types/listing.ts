export type ListingStatus = "ACTIVE" | "INACTIVE";

export type ListingOwner = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
};

export type ListingImage = {
  id: string;
  url: string;
  order: number;
};

export type ListingAvailability = {
  id: string;
  fromDate: string;
  toDate: string;
  availabilityStatus: string;
};

export type Listing = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: ListingStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  rooms: number;
  bedrooms: number;
  bathrooms?: number | null;
  capacity: number;
  amenities: string[];
  checkingInTime?: string | null;
  checkingOutTime?: string | null;
  basePrice: number;
  securityDepositPercentage?: number | null;
  cleaningFee?: number | null;
  serviceFee?: number | null;
  otherFees?: number | null;
  owner: ListingOwner;
  images: ListingImage[];
  availabilities: ListingAvailability[];
  counts: {
    bookings: number;
  };
};

export type CreateListingPayload = {
  title: string;
  description?: string | null;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive?: ListingStatus;
  ownerId: string;
  rooms: number;
  bedrooms: number;
  bathrooms?: number | null;
  capacity: number;
  amenities: string[];
  checkingInTime?: string | null;
  checkingOutTime?: string | null;
  basePrice: number;
  securityDepositPercentage?: number | null;
  cleaningFee?: number | null;
  serviceFee?: number | null;
  otherFees?: number | null;
};

export type UpdateListingPayload = Partial<CreateListingPayload>;
