import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { UserModel } from 'src/modules/users/models/user.model';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  /** Validates the JWT payload to check if the user is an admin.
   * @param {any} payload - JWT payload containing user information.
   * @returns {Promise<any>} Resolves to the payload if validation is successful.
   * @throws {UnauthorizedException} Throws an exception if validation fails.
   */
  async validate(payload: any): Promise<any> {
    try {
      // Fetch user record by username from JWT payload
      const user: UserModel = await this.usersService.fetchUserByUsername(
        payload.username,
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if user is authorized (admin role check)
      if (!user || user.roleId != 3) {
        throw new UnauthorizedException(
          'You are not authorized to perform the operation',
        );
      }

      // If all checks pass, return the payload
      return payload;
    } catch (e: any) {
      throw new UnauthorizedException('Unauthorized', e.message);
    }
  }
}
