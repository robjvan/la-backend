import { Column, DataType, Model, Table } from 'sequelize-typescript';
import {
  BuildCountryModelSeedData,
  CountryModelSeedData,
} from '../seeds/country.seed';

@Table
export class CountryModel extends Model<CountryModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  isoCode: string;

  public static async seed() {
    const seedData: CountryModelSeedData[] = await BuildCountryModelSeedData();

    const countryModels: CountryModel[] = [];
    for (const data of seedData) {
      const country: CountryModel = await CountryModel.create(data.country);
      countryModels.push(country);
    }
    return countryModels[0];
  }
}
