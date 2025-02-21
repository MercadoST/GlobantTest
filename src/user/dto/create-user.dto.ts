import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class ProfileDto {
  @IsString()
  code: string;

  @IsString()
  profileName: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
