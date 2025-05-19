import { CountryModel } from '../models/country.model';

export type CountryModelSeedData = {
  country: Partial<CountryModel>;
};

export const BuildCountryModelSeedData = async (): Promise<
  CountryModelSeedData[]
> => {
  return [
    {
      country: {
        name: 'canada',
        isoCode: 'ca',
      },
    },
    {
      country: {
        name: 'usa',
        isoCode: 'us',
      },
    },
  ];
};
