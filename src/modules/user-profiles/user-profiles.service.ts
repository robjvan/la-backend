import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { USER_PROFILE_REPOSITORY } from 'src/constants';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { UserProfileModel } from './models/user-profile.model';

/**
 * Service for managing user profiles.
 */
@Injectable()
export class UserProfilesService {
  /**
   * Constructor for the UserProfilesService, injecting the UserProfileRepository.
   * @param userProfileRepo - An instance of UserProfileModel representing the repository for user profiles.
   */
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepo: typeof UserProfileModel,
  ) {}

  /** Logger instance scoped to UserProfilesService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(UserProfilesService.name);

  /**
   * Handles common error logging and throwing for service methods.
   * @param error - The error message to log.
   * @param errorMsg - The error details.
   */
  private handleError(error: string, errorMsg: string): void {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Fetches all user profile records from the repository.
   * @returns An array of UserProfileModel objects representing the fetched profiles.
   */
  public async fetchAllProfiles(): Promise<UserProfileModel[]> {
    try {
      return await this.userProfileRepo.findAll();
    } catch (err: any) {
      this.handleError(`Failed to fetch profile records`, err.message);
    }
  }

  /**
   * Fetches a specific user profile record from the repository by ID.
   * @param id - The ID of the user associated with the profile to be fetched.
   * @returns A UserProfileModel object representing the found profile or throws NotFoundException if no record exists.
   */
  public async fetchProfileById(id: number): Promise<UserProfileModel> {
    try {
      const result = await this.userProfileRepo.findOne({ where: { id } });

      if (!result) {
        throw new NotFoundException(`Record with id ${id} does not exist`);
      }

      return result;
    } catch (err: any) {
      this.handleError(
        `Failed to fetch profile record with id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Fetches a specific user profile record from the repository by the associated user ID.
   * @param userId - The ID of the user associated with the profile to be fetched.
   * @returns A UserProfileModel object representing the found profile or throws NotFoundException if no record exists.
   */
  public async fetchProfileByUserId(id: number): Promise<UserProfileModel> {
    try {
      const result = await this.userProfileRepo.findOne({ where: { id } });

      if (!result) {
        throw new NotFoundException(`Record with id ${id} does not exist`);
      }

      return result;
    } catch (err: any) {
      this.handleError(
        `Failed to fetch profile record for user id ${id}`,
        err.message,
      );
    }
  }

  /**
   * Updates a specific user profile record with the provided data.
   * @param id - The ID of the user associated with the profile to be updated.
   * @param data - An object containing the new profile data.
   * @returns A UserProfileModel object representing the updated profile or throws an error if no record exists.
   */
  public async updateProfileById(
    id: number,
    data: UpdateProfileDto,
  ): Promise<UserProfileModel> {
    try {
      console.log(id, data);
      // TODO(RV): Add logic to update profile record
      return null;
    } catch (err: any) {
      this.handleError(
        `Failed to update user record with id ${id}`,
        err.message,
      );
    }
  }
}
