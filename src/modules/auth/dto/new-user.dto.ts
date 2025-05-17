import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class NewUserDto {
  @ApiProperty({
    name: 'username',
    required: true,
    description: 'Email address of the new user',
  })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    name: 'password',
    required: true,
    minLength: 6,
    description: 'Chosen password of the new user',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'newsletter',
    required: true,
    description: 'Whether the user wants to receive our newsletter',
  })
  @IsBoolean()
  @IsNotEmpty()
  newsletter: boolean;
}
