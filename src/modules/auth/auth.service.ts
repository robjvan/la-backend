import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_LOGIN_RECORD_REPOSITORY } from 'src/constants';
import { UserLoginRecordModel } from './models/user-login-record.model';
import { LocationsService } from '../locations/locations.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../users/models/user.model';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { NewPasswordDto } from './dto/new-password.dto';
import { JwtPayload } from './models/jwt-payload.interface';

/**
 * AuthService provides authentication and authorization-related functionality,
 * including login, password management, and token generation.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_LOGIN_RECORD_REPOSITORY)
    private readonly userLoginRepository: typeof UserLoginRecordModel,
    private readonly locationService: LocationsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private logger: Logger = new Logger(AuthService.name);

  /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Validates a user's credentials.
   *
   * @param username - The user's username.
   * @param pass - The raw password provided.
   * @returns The user model if valid, otherwise null.
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

  /**
   * Compares a raw password to a hashed one.
   *
   * @param enteredPassword - The password from the login request.
   * @param dbPassword - The hashed password from the database.
   * @returns True if passwords match, false otherwise.
   */ private async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  /**
   * Generates a signed JWT token for the given user payload.
   *
   * @param payload - The JWT payload to encode.
   * @returns A signed JWT token string.
   */
  private async generateToken(user: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(user);
  }

  /**
   * Creates a login record with IP and country information.
   * If any errors occur, they are logged but do not interrupt the login flow.
   *
   * @param userId - The ID of the user logging in.
   * @param ipAddress - The IP address from the request.
   */
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
      this.logger.warn(`Failed to create user login record`, err.message);
    }
  }

  /**
   * Confirms a user's email address using a token sent via email.
   *
   * @param emailToken - The token provided by the email confirmation link.
   * @returns The updated user record.
   */
  public async confirmUserEmailByToken(emailToken: string): Promise<UserModel> {
    try {
      const userRecord =
        await this.usersService.fetchUserByEmailToken(emailToken);

      await userRecord.update({ emailConfirmed: true, active: true });

      return await this.usersService.fetchUserById(userRecord.id);
    } catch (e: any) {
      this.logger.error(
        `Could not confirm user email using token: ${e.message}`,
      );
      throw new InternalServerErrorException(
        `Could not confirm user email using token: ${e.message}`,
      );
    }
  }

  /**
   * Logs in a user and returns a JWT token along with metadata.
   *
   * @param data - Login credentials (username & password).
   * @param ip - IP address from the request, used for location tracking.
   * @returns Auth response with user data and JWT token.
   */
  public async login(data: UserLoginDto, ip: string): Promise<any> {
    try {
      const userRecordPartial: UserModel = await this.validateUser(
        data.username,
        data.password,
      );

      if (!userRecordPartial) {
        throw new UnauthorizedException('Provided credentials are incorrect');
      } else {
        // Fetch user record
        const userRecord = await this.usersService.fetchUserByUsername(
          data.username,
        );

        const accessToken = await this.generateToken({
          username: data.username,
          userId: userRecord.id,
          roleId: userRecord.roleId,
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
            accessToken,
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

  /**
   * Retrieves all login records in the system.
   *
   * @returns List of all user login records.
   */
  public async findAllLoginRecords(): Promise<UserLoginRecordModel[]> {
    try {
      return await this.userLoginRepository.findAll();
    } catch (err: any) {
      this.handleError(`Failed to fetch user login records`, err.message);
    }
  }

  /**
   * Starts the forgot-password flow by generating a reset token
   * and emailing it to the user.
   *
   * @param username - The user's username or email.
   */
  public async startForgotPassWorkflow(username: string) {
    try {
      // Attempt to fetch user record
      const userRecord = await this.usersService.fetchUserByUsername(username);

      if (!userRecord) {
        throw new NotFoundException(
          `User record with email ${username} not found.`,
        );
      }

      // Generate new email token for user
      const emailToken = uuidv4();

      // Save new token to user record
      await userRecord.update({ emailToken });

      // Send email message with token to the user
      await this.mailService.sendForgotPasswordEmail(username, emailToken);
    } catch (err: any) {
      this.handleError(
        `Failed to start 'forgot password' workflow for username ${username}`,
        err.message,
      );
    }
  }

  /**
   * Submits a new password using a previously emailed token.
   *
   * @param username - The user's username.
   * @param data - Contains the reset token and new password.
   * @returns Success response on password update.
   */
  public async submitNewPassword(username: string, data: NewPasswordDto) {
    try {
      const { token, password } = data;

      // Fetch user record
      const userRecord = await this.usersService.fetchUserByUsername(username);

      if (!userRecord) {
        throw new NotFoundException();
      }

      if (token === userRecord.emailToken) {
        await this.usersService.updateUserById(userRecord.id, { password });

        this.mailService.sendPasswordUpdatedEmail(username);

        return { success: true, message: 'Password updated successfully' };
      } else {
        throw new UnauthorizedException(`Email token does not match`);
      }
    } catch (err: any) {
      this.handleError(
        `Failed to update password for ${username}`,
        err.message,
      );
    }
  }
}
