import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { CreateRateDto } from './dto/create-rate.dto';
import { RateItemParamsDto } from './dto/rate-item-params.dto';
import { RateParamsDto } from './dto/rate-params.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { ListingRatesService } from './listing-rates.service';

@Controller('listings/:listingId/rates')
export class ListingRatesController {
  constructor(private readonly listingRatesService: ListingRatesService) {}

  @AllowAnonymous()
  @Get()
  findAll(@Param() params: RateParamsDto) {
    return this.listingRatesService.findAll(params.listingId);
  }

  @AllowAnonymous()
  @Get(':rateId')
  findById(@Param() params: RateItemParamsDto) {
    return this.listingRatesService.findById(params.listingId, params.rateId);
  }

  @Roles(['ADMIN', 'AGENT'])
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Param() params: RateParamsDto, @Body() body: CreateRateDto) {
    return this.listingRatesService.create(params.listingId, body);
  }

  @Roles(['ADMIN', 'AGENT'])
  @Patch(':rateId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param() params: RateItemParamsDto, @Body() body: UpdateRateDto) {
    return this.listingRatesService.update(
      params.listingId,
      params.rateId,
      body,
    );
  }

  @Roles(['ADMIN', 'AGENT'])
  @Delete(':rateId')
  remove(@Param() params: RateItemParamsDto) {
    return this.listingRatesService.remove(params.listingId, params.rateId);
  }
}
