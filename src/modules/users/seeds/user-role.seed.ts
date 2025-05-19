import { UserRoleModel } from '../models/user-role.model';

export type UserRoleModelSeedData = {
  userRole: Partial<UserRoleModel>;
};

export const BuildUserRoleModelSeedData = async (): Promise<
  UserRoleModelSeedData[]
> => {
  return [
    {
      userRole: {
        name: 'user',
      },
    },
    {
      userRole: {
        name: 'tester',
      },
    },
    {
      userRole: {
        name: 'admin',
      },
    },
  ];
};
