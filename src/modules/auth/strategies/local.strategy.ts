import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /** Validates user credentials (username and password) against the authentication service.
   * @param {string} username - User's username.
   * @param {string} password - User's password.
   * @returns {Promise<any>} Resolves to the user object if validation is successful.
   * @throws {UnauthorizedException} Throws an exception if validation fails (invalid credentials).
   */
  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(username, password);

      if (!user) {
        throw new UnauthorizedException('Invalid user credentials');
      }

      return user;
    } catch (e: any) {
      throw new UnauthorizedException('Unauthorized', e.message);
    }
  }
}
