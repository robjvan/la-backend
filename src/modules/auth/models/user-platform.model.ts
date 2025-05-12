import { Column, DataType, Model, Table } from 'sequelize-typescript';
import {
  BuildUserPlatformModelSeedData,
  UserPlatformModelSeedData,
} from 'src/modules/auth/seeds/user-platform.seed';

@Table
export class UserPlatformModel extends Model<UserPlatformModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  public static async seed() {
    const seedData: UserPlatformModelSeedData[] =
      await BuildUserPlatformModelSeedData();

    const UserPlatformModels: UserPlatformModel[] = [];
    for (const data of seedData) {
      const userPlatform: UserPlatformModel = await UserPlatformModel.create(
        data.userPlatform,
      );
      UserPlatformModels.push(userPlatform);
    }
    return UserPlatformModels[0];
  }
}
