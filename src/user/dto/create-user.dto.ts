import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: false, description: 'User ID' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User age', minimum: 0 })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ type: () => CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}
