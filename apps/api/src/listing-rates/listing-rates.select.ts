export const rateSelect = {
  id: true,
  date: true,
  nightlyRate: true,
  note: true,
  listingId: true,
  createdAt: true,
  updatedAt: true,
  overriddenAt: true,
} as const;

export const rateBatchSelect = {
  id: true,
  fromDate: true,
  toDate: true,
  price: true,
  note: true,
  listingId: true,
  createdAt: true,
  updatedAt: true,
} as const;
