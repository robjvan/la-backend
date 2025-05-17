import { UserPlatformModel } from 'src/modules/auth/models/user-platform.model';

export type UserPlatformModelSeedData = {
  userPlatform: Partial<UserPlatformModel>;
};

export const BuildUserPlatformModelSeedData = async (): Promise<
  UserPlatformModelSeedData[]
> => {
  return [
    {
      userPlatform: {
        name: 'web',
      },
    },
    {
      userPlatform: {
        name: 'ios',
      },
    },
    {
      userPlatform: {
        name: 'android',
      },
    },
    {
      userPlatform: {
        name: 'windows',
      },
    },
    {
      userPlatform: {
        name: 'macos',
      },
    },
    {
      userPlatform: {
        name: 'linux',
      },
    },
    {
      userPlatform: {
        name: 'unknown',
      },
    },
  ];
};
