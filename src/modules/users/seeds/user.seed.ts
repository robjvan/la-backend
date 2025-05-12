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
    // Add admin user
    {
      user: {
        username: 'dad@dad.com',
        password: await bcrypt.hash('Asdf123!', 10), // replace with hashed version
        smsToken: Math.floor(100000 + Math.random() * 900000),
        emailToken: uuidv4(),
        emailConfirmed: true,
        newsletter: false,
        roleId: 3,
        // tier: 0,
        // lastPaymentDate: null,
        // renewDate: null,
        // countryId: 1,
      },
    },
    {
      user: {
        username: 'dad2@dad.com',
        password: await bcrypt.hash('Asdf123!', 10), // replace with hashed version
        smsToken: Math.floor(100000 + Math.random() * 900000),
        emailToken: uuidv4(),
        emailConfirmed: true,
        newsletter: false,
        roleId: 1,
        // tier: 0,
        // lastPaymentDate: null,
        // renewDate: null,
        // countryId: 1,
      },
    },
    // Add sample user profile
    // {
    //   user: {
    //     username: 'Test Employee',
    //     password: '', // ereplace with hashed version
    //     employeePin: '1111',
    //     userTypeId: 1,
    //     smsToken: 123456,
    //     emailToken: 'employeeemailtoken',
    //     emailConfirmed: true,
    //     newsletter: false,
    //     firstName: 'Employee',
    //     lastName: 'User',
    //     regionId: null,
    //     districtId: null,
    //     shippingAddressId: null,
    //     billingAddressId: null,
    //   },
    // },
  ];
};
