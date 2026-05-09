import { Module } from '@nestjs/common';
import { ListingRatesController } from './listing-rates.controller';
import { ListingRatesService } from './listing-rates.service';

@Module({
  controllers: [ListingRatesController],
  providers: [ListingRatesService],
})
export class ListingRatesModule {}
