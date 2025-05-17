import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
  USER_SUBSCRIPTION_REPOSITORY,
} from 'src/constants';
import { UserModel } from './models/user.model';
// import { UserProfileModel } from './models/user-profile.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewUserDto } from '../auth/dto/new-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { LocationsService } from '../locations/locations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CountryModel } from '../locations/models/country.model';
import { MailService } from '../mail/mail.service';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';
import { UserSubscriptionModel } from '../subscriptions/models/user-subscription.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: typeof UserModel,
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepo: typeof UserProfileModel,
    @Inject(USER_SUBSCRIPTION_REPOSITORY)
    private readonly userSubscriptionsRepo: typeof UserSubscriptionModel,
    private readonly locationService: LocationsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mailService: MailService,
  ) {}

  /** Logger instance scoped to UsersService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(UsersService.name);

  /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Fetches all user records from the database.
   * @returns {UserModel[]} A list of User objects.
   */
  public async fetchAllUsers(): Promise<UserModel[]> {
    try {
      return await this.userRepo.findAll();
    } catch (err: any) {
      this.handleError(`Failed to fetch user records`, err.message);
    }
  }

  /**
   * Fetches a user record by username.
   * @param username The username to search for.
   * @returns {UserModel} The user record if found, otherwise throws a NotFoundException.
   */
  public async fetchUserByUsername(username: string): Promise<UserModel> {
    try {
      const result = await this.userRepo.findOne({ where: { username } });

      if (!result) {
        throw new NotFoundException(
          `Record with username ${username} does not exist`,
        );
      }

      return result;
    } catch (err: any) {
      this.handleError(
        `Failed to fetch record for username ${username}`,
        err.message,
      );
    }
  }

  /**
   * Fetches a user record by ID.
   * @param id The ID of the user to fetch.
   * @returns {UserModel} The user record if found, otherwise throws a NotFoundException.
   */
  public async fetchUserById(id: number): Promise<UserModel> {
    try {
      const result = await this.userRepo.findOne({ where: { id } });

      if (!result) {
        throw new NotFoundException(`Record with id ${id} does not exist`);
      }

      return result;
    } catch (err: any) {
      this.handleError(`Failed to fetch record for id ${id}`, err.message);
    }
  }

  /**
   * Creates a new user record.
   * @param data The NewUserDto containing user data.
   * @param ip The IP address of the request.
   * @returns {HttpStatus}  A status code indicating success (201 Created).
   */
  public async createNewUser(
    data: NewUserDto,
    ip: string,
  ): Promise<HttpStatus> {
    try {
      // Check if record with given username already exists
      const existingRecord = await this.userRepo.findOne({
        where: { username: data.username },
      });

      if (existingRecord) {
        throw new InternalServerErrorException(`Username already in use`);
      }

      let countryRecord: CountryModel;
      // let newProfileRecord: UserProfileModel;

      // Try to determine the user's country based from the request IP
      try {
        countryRecord = await this.locationService.processCountryFromIp(ip);
      } catch {
        // This has a separate try/catch to continue to avoid crashing the workflow without a country record
      }

      const newUserRecord = await this.userRepo.create({
        username: data.username,
        password: await bcrypt.hash(data.password, 10),
        smsToken: Math.floor(100000 + Math.random() * 900000),
        emailToken: uuidv4(),
        emailConfirmed: false,
        newsletter: data.newsletter ?? true,
        roleId: 0,
        active: false,
      });

      // if (countryRecord) {
      const newProfileRecord = this.userProfileRepo.create({
        userId: newUserRecord.id,
        countryId: countryRecord.id,
      });
      // }
      // else {
      //   newProfileRecord = this.userProfileRepo.build({
      //     userId: newUserRecord.id,
      //   });
      // }

      const newSubscriptionRecord =
        await this.subscriptionsService.createDefaultSubscription(
          newUserRecord.id,
        );

      if (newUserRecord && newProfileRecord && newSubscriptionRecord) {
        // Send "confirm email" message
        // await this.mailService.sendConfirmEmailMessage(data.username);

        // Return 201 status
        return HttpStatus.CREATED;
      }
    } catch (err: any) {
      // Roll back any records that have been created
      const userRecord = await this.userRepo.findOne({
        where: { username: data.username },
      });

      if (userRecord) {
        const [profileRecord, subscriptionRecord] = await Promise.all([
          await this.userProfileRepo.findOne({
            where: { userId: userRecord.id },
          }),
          await this.userSubscriptionsRepo.findOne({
            where: { userId: userRecord.id },
          }),
        ]);

        if (profileRecord) {
          await profileRecord.destroy();
        }

        if (subscriptionRecord) {
          await subscriptionRecord.destroy();
        }

        await userRecord.destroy();
        return;
      }
      this.handleError(`Failed to create new user`, err.message);
    }
  }

  /**
   * Updates a user record by ID.
   * @param id The ID of the user to update.
   * @param data The UpdateUserDto containing the updated user data.
   * @returns {UserModel} The updated user record.
   */
  public async updateUserById(
    id: number,
    data: UpdateUserDto,
  ): Promise<UserModel> {
    try {
      const userRecord = await this.fetchUserById(id);

      return await userRecord.update({ ...data });
    } catch (err: any) {
      this.handleError(
        `Failed to update user record with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Deactivates a user record by ID.  (Currently a placeholder)
   * @param id The ID of the user to deactivate.
   * @returns {UserModel} The deactivated user record.
   */
  public async deactivateUserById(id: number): Promise<UserModel> {
    try {
      console.log(id);
      // TODO(RV): Add logic to mark user record as deactivated
      return null;
    } catch (err: any) {
      this.handleError(
        `Failed to deactivate user record with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Fetches a user record by email token.
   * @param emailToken The email token.
   * @returns {UserModel} The user record if found, otherwise throws a NotFoundException.
   */
  public async fetchUserByEmailToken(emailToken: string): Promise<UserModel> {
    try {
      return await this.userRepo.findOne({ where: { emailToken } });
    } catch (err: any) {
      this.handleError(
        `Failed to fetch user record with token ${emailToken}`,
        err.message,
      );
    }
  }
}
