import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'username',
    required: true,
    description: 'Email or username of the user.',
    example: 'user@example.com',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    name: 'password',
    required: true,
    minLength: 6,
    description: 'Password of the user.',
    example: 'securePass123',
  })
  password: string;
}
