import {
  CITY_REPOSITORY,
  COUNTRY_REPOSITORY,
  FERTILIZER_RECORDS_REPOSITORY,
  PLANT_REPOSITORY,
  USER_LOGIN_RECORD_REPOSITORY,
  USER_PROFILE_REPOSITORY,
  USER_REPOSITORY,
  WATERING_RECORDS_REPOSITORY,
} from 'src/constants';
import { UserLoginRecordModel } from '../auth/models/user-login-record.model';
import { UserModel } from '../users/models/user.model';
import { PlantModel } from '../plants/models/plant.model';
import { UserProfileModel } from '../user-profiles/models/user-profile.model';
import { FertilizerRecordModel } from '../plants/models/fertilizer-record.model';
import { WateringRecordModel } from '../plants/models/watering-record.model';
import { CityModel } from '../locations/models/city.model';
import { CountryModel } from '../locations/models/country.model';

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
  {
    provide: WATERING_RECORDS_REPOSITORY,
    useValue: WateringRecordModel,
  },
  {
    provide: FERTILIZER_RECORDS_REPOSITORY,
    useValue: FertilizerRecordModel,
  },
  {
    provide: COUNTRY_REPOSITORY,
    useValue: CountryModel,
  },
  {
    provide: CITY_REPOSITORY,
    useValue: CityModel,
  },
];
