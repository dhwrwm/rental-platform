import { IsString, MinLength } from 'class-validator';

export class RateParamsDto {
  @IsString()
  @MinLength(1)
  listingId!: string;
}
