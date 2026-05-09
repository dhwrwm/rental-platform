import { IsString, MinLength } from 'class-validator';

export class AvailabilityItemParamsDto {
  @IsString()
  @MinLength(1)
  listingId!: string;

  @IsString()
  @MinLength(1)
  availabilityId!: string;
}
