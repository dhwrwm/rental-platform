import {
  IsDateString,
  IsDefined,
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsDefined({ message: 'listingId is required' })
  @IsString()
  @MinLength(1)
  listingId!: string;

  @IsDefined({ message: 'renterId is required' })
  @IsString()
  @MinLength(1)
  renterId!: string;

  @IsDefined({ message: 'checkIn is required' })
  @IsDateString()
  checkIn!: string;

  @IsDefined({ message: 'checkOut is required' })
  @IsDateString()
  checkOut!: string;

  @IsDefined({ message: 'guestsCount is required' })
  @IsInt()
  @Min(1)
  guestsCount!: number;
}
