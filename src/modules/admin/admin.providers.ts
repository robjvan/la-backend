import {
  PLANT_REPOSITORY,
  USER_LOGIN_RECORD_REPOSITORY,
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
} from 'src/constants';
import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { UserModel } from '../users/models/user.model';
import { PlantModel } from '../plants/models/plant.model';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';

export const adminProviders = [
  {
    provide: USER_LOGIN_RECORD_REPOSITORY,
    useValue: UserLoginRecordModel,
  },
  {
    provide: USER_REPOSITORY,
    useValue: UserModel,
  },
  {
    provide: PLANT_REPOSITORY,
    useValue: PlantModel,
  },
  {
    provide: USER_PROFILE_REPOSITORY,
    useValue: UserProfileModel,
  },
];
