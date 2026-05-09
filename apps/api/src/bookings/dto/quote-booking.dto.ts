import { IsDateString, IsDefined, IsString, MinLength } from 'class-validator';

export class QuoteBookingDto {
  @IsDefined({ message: 'listingId is required' })
  @IsString()
  @MinLength(1)
  listingId!: string;

  @IsDefined({ message: 'checkIn is required' })
  @IsDateString()
  checkIn!: string;

  @IsDefined({ message: 'checkOut is required' })
  @IsDateString()
  checkOut!: string;
}
