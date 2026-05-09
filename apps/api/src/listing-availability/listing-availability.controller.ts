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
import { AvailabilityItemParamsDto } from './dto/availability-item-params.dto';
import { AvailabilityParamsDto } from './dto/availability-params.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { ListingAvailabilityService } from './listing-availability.service';

@Controller('listings/:listingId/availability')
export class ListingAvailabilityController {
  constructor(
    private readonly listingAvailabilityService: ListingAvailabilityService,
  ) {}

  @AllowAnonymous()
  @Get()
  findAll(@Param() params: AvailabilityParamsDto) {
    return this.listingAvailabilityService.findAll(params.listingId);
  }

  @AllowAnonymous()
  @Get(':availabilityId')
  findById(@Param() params: AvailabilityItemParamsDto) {
    return this.listingAvailabilityService.findById(
      params.listingId,
      params.availabilityId,
    );
  }

  @Roles(['ADMIN', 'AGENT'])
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Param() params: AvailabilityParamsDto,
    @Body() body: CreateAvailabilityDto,
  ) {
    return this.listingAvailabilityService.create(params.listingId, body);
  }

  @Roles(['ADMIN', 'AGENT'])
  @Patch(':availabilityId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param() params: AvailabilityItemParamsDto,
    @Body() body: UpdateAvailabilityDto,
  ) {
    return this.listingAvailabilityService.update(
      params.listingId,
      params.availabilityId,
      body,
    );
  }

  @Roles(['ADMIN', 'AGENT'])
  @Delete(':availabilityId')
  remove(@Param() params: AvailabilityItemParamsDto) {
    return this.listingAvailabilityService.remove(
      params.listingId,
      params.availabilityId,
    );
  }
}
