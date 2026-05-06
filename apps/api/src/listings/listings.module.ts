import { Module } from '@nestjs/common';
import { ListingAvailabilityModule } from './availability/listing-availability.module';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  imports: [ListingAvailabilityModule],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
