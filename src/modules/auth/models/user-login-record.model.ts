import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CountryModel } from 'src/modules/locations/models/country.model';
import { UserModel } from 'src/modules/users/models/user.model';

@Table
export class UserLoginRecordModel extends Model<UserLoginRecordModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.DATE)
  timestamp: Date;

  @ForeignKey(() => CountryModel)
  @Column(DataType.INTEGER)
  countryId: number;

  @Column(DataType.TEXT)
  ipAddress: string;

  // public static async seed() {
  //   const seedData: UserLoginRecordModelSeedData[] =
  //     await BuildUserLoginRecordModelSeedData();

  //   const UserLoginRecordModels: UserLoginRecordModel[] = [];
  //   for (const data of seedData) {
  //     const UserLoginRecordModel: UserLoginRecordModel =
  //       await UserLoginRecordModel.create(data.UserLoginRecordModel);
  //     UserLoginRecordModels.push(UserLoginRecordModel);
  //   }
  //   return UserLoginRecordModels[0];
  // }
}
