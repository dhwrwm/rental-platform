import { Module } from '@nestjs/common';
import { ListingAvailabilityModule } from './availability/listing-availability.module';
import { ListingRatesModule } from './rates/listing-rates.module';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  imports: [ListingAvailabilityModule, ListingRatesModule],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
