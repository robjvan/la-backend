import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserModel } from '../models/user.model';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(UserModel) {
  @ApiProperty({
    name: 'password',
    required: false,
    description: 'Optional new password for the user.',
    example: 'newSecurePassword',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    name: 'newsletter',
    required: false,
    description: 'Whether the user wants to receive our newsletter.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  newsletter: boolean;
}
