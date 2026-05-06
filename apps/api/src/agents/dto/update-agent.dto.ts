import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAgentDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  isActive?: boolean;
}
