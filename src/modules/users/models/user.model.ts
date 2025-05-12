import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserModelSeedData, BuildUserModelSeedData } from '../seeds/user.seed';

@Table
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @Column(DataType.TEXT)
  username: string;

  @Column(DataType.TEXT)
  password: string;

  smsToken: number;
  emailToken: string;
  emailConfirmed: boolean;
  newsletter: boolean;
  roleId: number;

  public static async seed() {
    const seedData: UserModelSeedData[] = await BuildUserModelSeedData();

    const userModels: UserModel[] = [];
    for (const data of seedData) {
      const user: UserModel = await UserModel.create(data.user);
      userModels.push(user);
    }
    return userModels[0];
  }
}
