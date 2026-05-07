import {
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRateDto {
  @IsDefined({ message: 'fromDate is required' })
  @IsDateString()
  fromDate!: string;

  @IsDefined({ message: 'toDate is required' })
  @IsDateString()
  toDate!: string;

  @IsDefined({ message: 'price is required' })
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  note?: string | null;
}
