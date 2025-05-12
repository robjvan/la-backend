import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import {
  BuildUserProfileModelSeedData,
  UserProfileModelSeedData,
} from '../seeds/user-profile.seed';

@Table
export class UserProfileModel extends Model<UserProfileModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @ForeignKey(() => UserModel)
  userId: number;

  @Column(DataType.TEXT)
  firstName: string;

  @Column(DataType.TEXT)
  lastName: string;

  @Column(DataType.INTEGER)
  cityId: number;

  @Column(DataType.TEXT)
  growingZone: string;

  @Column(DataType.INTEGER)
  countryId: number;

  public static async seed() {
    const seedData: UserProfileModelSeedData[] =
      await BuildUserProfileModelSeedData();

    const userProfiles: UserProfileModel[] = [];
    for (const data of seedData) {
      const userProfile: UserProfileModel = await UserProfileModel.create(
        data.userProfile,
      );
      userProfiles.push(userProfile);
    }
    return userProfiles[0];
  }
}
