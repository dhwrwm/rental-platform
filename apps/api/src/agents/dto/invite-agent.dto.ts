import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class InviteAgentDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
