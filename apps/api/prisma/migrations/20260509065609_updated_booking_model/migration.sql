/*
  Warnings:

  - A unique constraint covering the columns `[listingId,renterId,checkIn,checkOut]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingPriceid` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestsCount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BookingPrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingPrice" DROP CONSTRAINT "BookingPrice_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookedAt" TIMESTAMP(3),
ADD COLUMN     "bookingPriceid" TEXT NOT NULL,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guestsCount" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BookingPrice" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_listingId_checkIn_checkOut_idx" ON "Booking"("listingId", "checkIn", "checkOut");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_listingId_renterId_checkIn_checkOut_key" ON "Booking"("listingId", "renterId", "checkIn", "checkOut");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bookingPriceid_fkey" FOREIGN KEY ("bookingPriceid") REFERENCES "BookingPrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
