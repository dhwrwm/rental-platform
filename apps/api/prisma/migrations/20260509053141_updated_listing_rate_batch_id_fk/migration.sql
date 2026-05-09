-- DropForeignKey
ALTER TABLE "ListingRate" DROP CONSTRAINT "ListingRate_id_fkey";

-- AlterTable
ALTER TABLE "ListingRate" ADD COLUMN     "rateBatchId" TEXT;

-- AddForeignKey
ALTER TABLE "ListingRate" ADD CONSTRAINT "ListingRate_rateBatchId_fkey" FOREIGN KEY ("rateBatchId") REFERENCES "ListingRateBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
