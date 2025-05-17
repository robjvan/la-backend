import { UserProfileModel } from '../models/user-profile.model';

export type UserProfileModelSeedData = {
  userProfile: Partial<UserProfileModel>;
};

export const BuildUserProfileModelSeedData = async (): Promise<
  UserProfileModelSeedData[]
> => {
  return [
    {
      userProfile: {
        userId: 1,
        firstName: 'Rob',
        lastName: 'Vandelinder',
        cityId: null,
        growingZone: null,
        countryId: 1,
      },
    },
    {
      userProfile: {
        userId: 1,
        firstName: 'Rob',
        lastName: 'Vandelinder',
        cityId: null,
        growingZone: null,
        countryId: 1,
      },
    },
  ];
};
