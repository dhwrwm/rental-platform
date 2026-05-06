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
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingParamsDto } from './dto/listing-params.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @AllowAnonymous()
  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @AllowAnonymous()
  @Get(':id')
  findById(@Param() params: ListingParamsDto) {
    return this.listingsService.findById(params.id);
  }

  @Roles(['ADMIN', 'AGENT'])
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateListingDto) {
    return this.listingsService.create(body);
  }

  @Roles(['ADMIN', 'AGENT'])
  @Patch(':id')
  update(@Param() params: ListingParamsDto, @Body() body: UpdateListingDto) {
    return this.listingsService.update(params.id, body);
  }

  @Roles(['ADMIN', 'AGENT'])
  @Delete(':id')
  remove(@Param() params: ListingParamsDto) {
    return this.listingsService.remove(params.id);
  }
}
