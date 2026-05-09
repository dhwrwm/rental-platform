/*
  Warnings:

  - Changed the type of `fromDate` on the `ListingAvailability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toDate` on the `ListingAvailability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ListingAvailability" DROP COLUMN "fromDate",
ADD COLUMN     "fromDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "toDate",
ADD COLUMN     "toDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "ListingAvailability_listingId_fromDate_toDate_idx" ON "ListingAvailability"("listingId", "fromDate", "toDate");
