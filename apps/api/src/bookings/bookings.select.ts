export const bookingSelect = {
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
