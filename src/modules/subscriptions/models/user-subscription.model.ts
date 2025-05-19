import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  BuildUserSubscriptionModelSeedData,
  UserSubscriptionModelSeedData,
} from '../seeds/user-subscription.seed';
import { UserModel } from 'src/modules/users/models/user.model';

@Table
export class UserSubscriptionModel extends Model<UserSubscriptionModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.INTEGER)
  tier: number;

  public static async seed() {
    const seedData: UserSubscriptionModelSeedData[] =
      await BuildUserSubscriptionModelSeedData();

    const userSusbcriptionModels: UserSubscriptionModel[] = [];
    for (const data of seedData) {
      const userSubscription: UserSubscriptionModel =
        await UserSubscriptionModel.create(data.userSubscription);
      userSusbcriptionModels.push(userSubscription);
    }
    return userSusbcriptionModels[0];
  }
}
