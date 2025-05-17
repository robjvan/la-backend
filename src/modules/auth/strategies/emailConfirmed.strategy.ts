import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class EmailConfirmedStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  /** Validates the JWT payload to check if the user exists and has confirmed email.
   * @param {any} payload - JWT payload containing user information.
   * @returns {Promise<any>} Resolves to the payload if validation is successful.
   * @throws {UnauthorizedException} Throws an exception if validation fails.
   */
  async validate(payload: any): Promise<any> {
    try {
      /// Check if user in the token actually exists
      const user = await this.usersService.fetchUserByUsername(
        payload.username,
      );

      if (!user) {
        throw new UnauthorizedException(
          'You are not authorized to perform the operation',
        );
      }

      // Check if user has confirmed their email address
      if (!user.emailConfirmed) {
        throw new UnauthorizedException('User has not confirmed email address');
      }

      // If all checks pass, return the payload
      return payload;
    } catch (e: any) {
      console.log(e);
      // TODO(RV): Add error handling here
    }
  }
}
