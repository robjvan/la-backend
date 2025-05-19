import { CITY_REPOSITORY, COUNTRY_REPOSITORY } from 'src/constants';
import { CountryModel } from './models/country.model';
import { CityModel } from './models/city.model';

export const locationsProviders = [
  {
    provide: COUNTRY_REPOSITORY,
    useValue: CountryModel,
  },
  {
    provide: CITY_REPOSITORY,
    useValue: CityModel,
  },
];
