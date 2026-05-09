import { IsString, MinLength } from 'class-validator';

export class AvailabilityParamsDto {
  @IsString()
  @MinLength(1)
  listingId!: string;
}
