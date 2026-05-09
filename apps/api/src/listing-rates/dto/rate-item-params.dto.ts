import { IsString, MinLength } from 'class-validator';

export class RateItemParamsDto {
  @IsString()
  @MinLength(1)
  listingId!: string;

  @IsString()
  @MinLength(1)
  rateId!: string;
}
