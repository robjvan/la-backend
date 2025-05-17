import { USER_PROFILE_REPOSITORY } from 'src/constants';
import { UserProfileModel } from './models/user-profile.model';

export const usersProfilesProviders = [
  {
    provide: USER_PROFILE_REPOSITORY,
    useValue: UserProfileModel,
  },
];
