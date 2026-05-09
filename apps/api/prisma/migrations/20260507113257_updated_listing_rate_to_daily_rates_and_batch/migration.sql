/*
  Warnings:

  - You are about to drop the column `fromDate` on the `ListingRate` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ListingRate` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `ListingRate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId,date]` on the table `ListingRate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `ListingRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nightlyRate` to the `ListingRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListingRate" DROP COLUMN "fromDate",
DROP COLUMN "price",
DROP COLUMN "toDate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nightlyRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "overriddenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ListingRateBatch" (
    "id" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingRateBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingRateBatch_listingId_fromDate_toDate_idx" ON "ListingRateBatch"("listingId", "fromDate", "toDate");

-- CreateIndex
CREATE INDEX "ListingAvailability_listingId_fromDate_toDate_idx" ON "ListingAvailability"("listingId", "fromDate", "toDate");

-- CreateIndex
CREATE INDEX "ListingRate_listingId_date_idx" ON "ListingRate"("listingId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ListingRate_listingId_date_key" ON "ListingRate"("listingId", "date");

-- AddForeignKey
ALTER TABLE "ListingRate" ADD CONSTRAINT "ListingRate_id_fkey" FOREIGN KEY ("id") REFERENCES "ListingRateBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRateBatch" ADD CONSTRAINT "ListingRateBatch_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
