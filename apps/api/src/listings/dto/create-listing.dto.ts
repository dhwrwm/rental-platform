import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ListingStatus } from '../../generated/prisma';

export class CreateListingDto {
  @IsDefined({ message: 'title is required' })
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsDefined({ message: 'longitude is required' })
  @IsNumber()
  longitude!: number;

  @IsDefined({ message: 'latitude is required' })
  @IsNumber()
  latitude!: number;

  @IsDefined({ message: 'address is required' })
  @IsString()
  @MinLength(1)
  address!: string;

  @IsDefined({ message: 'city is required' })
  @IsString()
  @MinLength(1)
  city!: string;

  @IsDefined({ message: 'state is required' })
  @IsString()
  @MinLength(1)
  state!: string;

  @IsDefined({ message: 'country is required' })
  @IsString()
  @MinLength(1)
  country!: string;

  @IsOptional()
  @IsEnum(ListingStatus)
  isActive?: ListingStatus;

  @IsDefined({ message: 'ownerId is required' })
  @IsString()
  @MinLength(1)
  ownerId!: string;

  @IsDefined({ message: 'rooms is required' })
  @IsNumber()
  @Min(0)
  rooms!: number;

  @IsDefined({ message: 'bedrooms is required' })
  @IsNumber()
  @Min(0)
  bedrooms!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number | null;

  @IsDefined({ message: 'capacity is required' })
  @IsNumber()
  @Min(1)
  capacity!: number;

  @IsDefined({ message: 'amenities is required' })
  @IsArray()
  @IsString({ each: true })
  amenities!: string[];

  @IsOptional()
  @IsString()
  checkingInTime?: string | null;

  @IsOptional()
  @IsString()
  checkingOutTime?: string | null;

  @IsDefined({ message: 'basePrice is required' })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  securityDepositPercentage?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cleaningFee?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceFee?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otherFees?: number | null;
}
