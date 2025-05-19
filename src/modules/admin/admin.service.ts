import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { USER_LOGIN_RECORD_REPOSITORY } from 'src/constants';

@Injectable()
export class AdminService {
  constructor(
    @Inject(USER_LOGIN_RECORD_REPOSITORY)
    private readonly userLoginRepo: typeof UserLoginRecordModel,
  ) {}

  /** Logger instance scoped to AdminService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(AdminService.name);

  /**
   * Handles common error logging and throwing for service methods.
   * @param {string} error - The error message.
   * @param {string} errorMsg - Additional context for the error.
   */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Retrieves all user login records.
   * @returns {Promise<UserLoginRecordModel[]>} Array of UserLoginRecordModel objects.
   */
  public async getAllLoginRecords(): Promise<UserLoginRecordModel[]> {
    try {
      return await this.userLoginRepo.findAll();
    } catch (err: any) {
      this.handleError(`Failed to fetch user login records`, err.message);
    }
  }

  /**
   * Retrieves all login records for a specific user by their ID.
   * @param {number} userId - The user's ID.
   * @returns {Promise<UserLoginRecordModel[]>} Array of UserLoginRecordModel objects.
   */
  public async getAllLoginRecordsByUserId(
    userId: number,
  ): Promise<UserLoginRecordModel[]> {
    try {
      return await this.userLoginRepo.findAll({ where: { userId } });
    } catch (err: any) {
      this.handleError(
        `Failed to fetch login records for user with id ${userId}`,
        err.message,
      );
    }
  }
}
