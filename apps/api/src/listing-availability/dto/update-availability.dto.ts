import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AvailabilityStatus } from '../../generated/prisma';

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsEnum(AvailabilityStatus)
  availabilityStatus?: AvailabilityStatus;
}
