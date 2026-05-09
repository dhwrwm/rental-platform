export const BOOKING_GST_PERCENTAGE = 12;
export const PLATFORM_GST_PERCENTAGE = 18;

type BookingRateSource = 'BASE' | 'CUSTOM';

type BookingPriceRate = {
  date: Date;
  nightlyRate: number;
};

type CalculateBookingPriceInput = {
  listingId: string;
  checkIn: Date;
  checkOut: Date;
  nights: Date[];
  basePrice: number;
  securityDepositPercentage?: number | null;
  cleaningFee?: number | null;
  serviceFee?: number | null;
  otherFees?: number | null;
  rates: BookingPriceRate[];
};

type NightlyPriceBreakdown = {
  date: string;
  nightlyRate: number;
  source: BookingRateSource;
};

export function calculateBookingPrice(input: CalculateBookingPriceInput) {
  const ratesByDate = new Map(
    input.rates.map((rate) => [toDateKey(rate.date), rate]),
  );
  const nightlyRates: NightlyPriceBreakdown[] = input.nights.map((date) => {
    const rate = ratesByDate.get(toDateKey(date));

    return {
      date: date.toISOString(),
      nightlyRate: rate?.nightlyRate ?? input.basePrice,
      source: rate ? 'CUSTOM' : 'BASE',
    };
  });
  const nightlySubtotal = nightlyRates.reduce(
    (total, rate) => total + rate.nightlyRate,
    0,
  );
  const cleaningFee = input.cleaningFee ?? 0;
  const serviceFee = input.serviceFee ?? 0;
  const otherFees = input.otherFees ?? 0;
  const feesTotal = cleaningFee + serviceFee + otherFees;
  const securityDepositPercentage = input.securityDepositPercentage ?? 0;
  const securityDeposit = (nightlySubtotal * securityDepositPercentage) / 100;
  const bookingGstTaxableAmount = nightlySubtotal + cleaningFee + otherFees;
  const bookingGst = (bookingGstTaxableAmount * BOOKING_GST_PERCENTAGE) / 100;
  const platformGst = (serviceFee * PLATFORM_GST_PERCENTAGE) / 100;
  const taxesTotal = bookingGst + platformGst;
  const totalPrice = nightlySubtotal + feesTotal + taxesTotal + securityDeposit;

  return {
    listingId: input.listingId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    nights: input.nights.length,
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
      bookingGst: {
        percentage: BOOKING_GST_PERCENTAGE,
        taxableAmount: bookingGstTaxableAmount,
        amount: bookingGst,
      },
      platformGst: {
        percentage: PLATFORM_GST_PERCENTAGE,
        taxableAmount: serviceFee,
        amount: platformGst,
      },
      total: taxesTotal,
    },
    totalPrice,
    priceBreakdown: {
      nightlyRates,
    },
  };
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
