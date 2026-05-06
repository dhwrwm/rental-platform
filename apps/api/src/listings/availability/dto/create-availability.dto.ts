import { IsDateString, IsDefined, IsEnum } from 'class-validator';
import { AvailabilityStatus } from '../../../generated/prisma';

export class CreateAvailabilityDto {
  @IsDefined({ message: 'fromDate is required' })
  @IsDateString()
  fromDate!: string;

  @IsDefined({ message: 'toDate is required' })
  @IsDateString()
  toDate!: string;

  @IsDefined({ message: 'availabilityStatus is required' })
  @IsEnum(AvailabilityStatus)
  availabilityStatus!: AvailabilityStatus;
}
