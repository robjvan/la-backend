import { UserSubscriptionModel } from '../models/user-subscription.model';

export type UserSubscriptionModelSeedData = {
  userSubscription: Partial<UserSubscriptionModel>;
};

export const BuildUserSubscriptionModelSeedData = async (): Promise<
  UserSubscriptionModelSeedData[]
> => {
  return [
    {
      userSubscription: {
        userId: 1,
        // paid: false,

        tier: 0,
      },
    },
    {
      userSubscription: {
        userId: 2,
        // paid: false,

        tier: 0,
      },
    },
  ];
};
