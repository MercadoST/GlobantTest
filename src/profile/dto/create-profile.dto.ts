import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  code: string;

  @IsString()
  profileName: string;
}
