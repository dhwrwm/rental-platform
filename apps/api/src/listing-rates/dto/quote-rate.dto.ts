import {
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class QuoteRateDto {
  @IsDefined({ message: 'checkIn is required' })
  @IsDateString()
  checkIn!: string;

  @IsDefined({ message: 'checkOut is required' })
  @IsDateString()
  checkOut!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxPercentage?: number;
}
