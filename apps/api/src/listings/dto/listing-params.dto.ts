import { IsString, MinLength } from 'class-validator';

export class ListingParamsDto {
  @IsString()
  @MinLength(1)
  id!: string;
}
