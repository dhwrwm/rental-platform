import { Module } from '@nestjs/common';
import { ListingAvailabilityController } from './listing-availability.controller';
import { ListingAvailabilityService } from './listing-availability.service';

@Module({
  controllers: [ListingAvailabilityController],
  providers: [ListingAvailabilityService],
})
export class ListingAvailabilityModule {}
