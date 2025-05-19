import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/user.model';

export type UserModelSeedData = {
  user: Partial<UserModel>;
};

export const BuildUserModelSeedData = async (): Promise<
  UserModelSeedData[]
> => {
  return [
    {
      user: {
        username: 'dad@dad.com',
        password: await bcrypt.hash('Asdf123!', 10),
        smsToken: Math.floor(100000 + Math.random() * 900000),
        emailToken: uuidv4(),
        emailConfirmed: true,
        newsletter: false,
        roleId: 3,
        active: true,
        haveReviewed: true,
      },
    },
    {
      user: {
        username: 'dad2@dad.com',
        password: await bcrypt.hash('Asdf123!', 10),
        smsToken: Math.floor(100000 + Math.random() * 900000),
        emailToken: uuidv4(),
        emailConfirmed: true,
        newsletter: false,
        roleId: 1,
        active: true,
        haveReviewed: false,
      },
    },
  ];
};
