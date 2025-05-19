import { USER_SUBSCRIPTION_REPOSITORY } from 'src/constants';
import { UserSubscriptionModel } from './models/user-subscription.model';

export const subscriptionsProviders = [
  {
    provide: USER_SUBSCRIPTION_REPOSITORY,
    useValue: UserSubscriptionModel,
  },
];
