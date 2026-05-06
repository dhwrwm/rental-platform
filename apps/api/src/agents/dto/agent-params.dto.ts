import { IsString, MinLength } from 'class-validator';

export class AgentParamsDto {
  @IsString()
  @MinLength(1)
  id!: string;
}
