import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_LOGIN_RECORD_REPOSITORY } from 'src/constants';
import { UserLoginRecordModel } from './models/user-login-record.model';
import { LocationsService } from '../locations/locations.service';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../users/models/user.model';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_LOGIN_RECORD_REPOSITORY)
    private readonly userLoginRepository: typeof UserLoginRecordModel,
    private readonly locationService: LocationsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly subscriptionService: SubscriptionsService,
    // private readonly profileService: ProfileService,
  ) {}

  private logger: Logger = new Logger(AuthService.name);

  /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /** Validates a user based on the provided username and password.
   *
   * @param {string} username - The username of the user.
   * @param {string} pass - The user's password.
   * @returns {Promise<any>} A promise that resolves to the validated user or null if validation fails.
   */
  public async validateUser(
    username: string,
    pass: string,
  ): Promise<UserModel> {
    try {
      const user: UserModel =
        await this.usersService.fetchUserByUsername(username);
      if (!user || !(await this.comparePassword(pass, user.password))) {
        return null;
      }
      return user;
    } catch (e: any) {
      throw new InternalServerErrorException(e.message);
    }
  }

  /** Compares the entered password with the hashed password stored in the database.
   *
   * @param {string} enteredPassword - The entered password.
   * @param {string} dbPassword - The hashed password stored in the database.
   * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise.
   */
  private async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  /** Generates a JWT token for the given user.
   *
   * @param {any} user - The user for whom the token will be generated.
   * @returns {Promise<string>} A promise that resolves to the generated JWT token.
   */
  private async generateToken(user: any): Promise<string> {
    return await this.jwtService.signAsync(user);
  }

  private async createLoginRecord(userId: number, ipAddress: string) {
    try {
      // Get country name using IP address
      const country =
        await this.locationService.processCountryFromIp(ipAddress);

      // Use country name to getOrCreate Country record id
      const countryRecord = await this.locationService.getOrCreateRecord(
        'country',
        country.name,
      );

      // Create a login record entry
      await this.userLoginRepository.create({
        userId,
        ipAddress,
        countryId: countryRecord.id,
      });
    } catch (err: any) {
      // Log but don't throw an error
      console.log(`Failed to create user login record`, err.message);
    }
  }

  /** Confirms the user's email by validating the provided token.
   *
   * @param {string} emailToken - The token provided by the user to confirm their email.
   * @returns {Promise<UserModel>} A promise that resolves to the updated user record indicating the result.
   * @throws {InternalServerErrorException} If there is an error in confirming the email.
   */
  public async confirmUserEmailByToken(emailToken: string): Promise<UserModel> {
    try {
      const userRecord =
        await this.usersService.fetchUserByEmailToken(emailToken);

      return await userRecord.update({ emailConfirmed: true, active: true });
    } catch (e: any) {
      this.logger.error(
        `Could not confirm user email using token: ${e.message}`,
      );
      throw new InternalServerErrorException(
        `Could not confirm user email using token: ${e.message}`,
      );
    }
  }

  /** Logs in a user by generating and returning a JWT.
   *
   * @param {any} data - The user login credentials to process.
   * @returns {Promise<any>} A promise that resolves to the user and token.
   */
  public async login(data: UserLoginDto, ip: string): Promise<any> {
    try {
      const userRecordPartial: UserModel = await this.validateUser(
        data.username,
        data.password,
      );

      if (!userRecordPartial) {
        return new UnauthorizedException('Provided credentials are incorrect');
      } else {
        // Fetch user record
        const userRecord = await this.usersService.fetchUserByUsername(
          data.username,
        );

        const accessToken = await this.generateToken({
          username: data.username,
          password: data.password,
        });

        if (accessToken) {
          // Create a login record entry
          await this.createLoginRecord(userRecord.id, ip);

          // Update "last login" date
          const lastLogin = userRecord.lastLogin;
          await userRecord.update({ lastLogin: new Date() });

          // Return the user's relevant data
          return {
            username: userRecord.username,
            roleId: userRecord.roleId,
            userId: userRecord.id,
            lastLogin,
            accessToken: await this.generateToken({
              username: data.username,
              password: data.password,
            }),
            newsletter: userRecord.newsletter,
          };
        }
      }
    } catch (err: any) {
      this.handleError(
        `Failed to process user login for ${data.username}`,
        err.message,
      );
    }
  }
}
