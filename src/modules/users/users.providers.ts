import {
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
  USER_ROLE_REPOSITORY,
  USER_SUBSCRIPTION_REPOSITORY,
} from 'src/constants';
import { UserModel } from './models/user.model';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';
import { UserRoleModel } from './models/user-role.model';
import { UserSubscriptionModel } from '../subscriptions/models/user-subscription.model';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: UserModel,
  },
  {
    provide: USER_ROLE_REPOSITORY,
    useValue: UserRoleModel,
  },
  {
    provide: USER_PROFILE_REPOSITORY,
    useValue: UserProfileModel,
  },
  {
    provide: USER_SUBSCRIPTION_REPOSITORY,
    useValue: UserSubscriptionModel,
  },
];
