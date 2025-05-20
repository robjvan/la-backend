import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * DTO for submitting a new password during a password reset process.
 */
export class NewPasswordDto {
  /**
   * The token that verifies the password reset request.
   * This is typically emailed to the user.
   */
  @ApiProperty({
    example: '2f1c4a4a-ec0e-4de9-a0a9-1529f2a9c28f',
    description:
      'The token provided to the user to verify their password reset request.',
  })
  @IsString()
  token: string;

  /**
   * The new password the user wants to set.
   */
  @ApiProperty({
    example: 'MySecurePassword123!',
    description: 'The new password the user wants to assign to their account.',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
