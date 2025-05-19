import {
  USER_LOGIN_RECORD_REPOSITORY,
  USER_PLATFORM_REPOSITORY,
} from 'src/constants';
import { UserLoginRecordModel } from './models/user-login-record.model';
import { UserPlatformModel } from './models/user-platform.model';

export const authProviders = [
  {
    provide: USER_LOGIN_RECORD_REPOSITORY,
    useValue: UserLoginRecordModel,
  },
  {
    provide: USER_PLATFORM_REPOSITORY,
    useValue: UserPlatformModel,
  },
];
