import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CreateBookingDto } from './dto/create-booking-dto';
import { QuoteBookingDto } from './dto/quote-booking.dto';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateBookingDto) {
    return this.bookingsService.create(body);
  }

  @AllowAnonymous()
  @Post('quote')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  quote(@Body() body: QuoteBookingDto) {
    return this.bookingsService.quote(body);
  }
}
