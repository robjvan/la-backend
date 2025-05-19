import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModelSeedData, BuildUserModelSeedData } from '../seeds/user.seed';
import { UserRoleModel } from './user-role.model';

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

  @Column(DataType.INTEGER)
  smsToken: number;

  @Column(DataType.TEXT)
  emailToken: string;

  @Column(DataType.BOOLEAN)
  emailConfirmed: boolean;

  @Column(DataType.BOOLEAN)
  newsletter: boolean;

  @ForeignKey(() => UserRoleModel)
  @Column(DataType.INTEGER)
  roleId: number;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.BOOLEAN)
  haveReviewed: boolean;

  @Column(DataType.DATE)
  lastLogin?: Date;

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
