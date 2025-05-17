import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserSubscriptionModel } from './models/user-subscription.model';
import { USER_SUBSCRIPTION_REPOSITORY } from 'src/constants';

/**
 * The SubscriptionsService handles all operations related to user subscriptions.
 */
@Injectable()
export class SubscriptionsService {
  /**
   * Constructor for the SubscriptionsService, injecting the UserSubscriptionRepository.
   * @param userSubscriptionRepo - An instance of UserSubscriptionModel representing the repository for user subscriptions.
   */
  constructor(
    @Inject(USER_SUBSCRIPTION_REPOSITORY)
    private readonly userSubscriptionRepo: typeof UserSubscriptionModel,
  ) {}

  /** Logger instance scoped to SubscriptionsService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(SubscriptionsService.name);

  /**
   * Handles common error logging and throwing for service methods.
   * @param error - The error message to log.
   * @param errorMsg - The error details.
   */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Creates a default subscription for a user.
   * @param userId - The ID of the user associated with the subscription.
   * @returns A UserSubscriptionModel object representing the created subscription.
   */
  public async createDefaultSubscription(
    userId: number,
  ): Promise<UserSubscriptionModel> {
    try {
      return await this.userSubscriptionRepo.create({
        userId,
        tier: 0,
      });
    } catch (err: any) {
      this.handleError(
        `Failed to create new user subscription record`,
        err.message,
      );
    }
  }

  /**
   * Retrieves the subscription of a specific user by ID.
   * @param userId - The ID of the user associated with the subscription.
   * @returns A UserSubscriptionModel object representing the found subscription or throws NotFoundException if no record exists.
   */
  public async findOneByUserId(userId: number) {
    try {
      const result = await this.userSubscriptionRepo.findOne({
        where: { userId },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return result;
    } catch (err: any) {
      this.handleError(`Failed to fetch user subscription record`, err.message);
    }
  }
}
