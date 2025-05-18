import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  BuildWateringRecordModelSeedData,
  WateringRecordModelSeedData,
} from '../seeds/watering-record.seed';
import { PlantModel } from './plant.model';

@Table
export class WateringRecordModel extends Model<WateringRecordModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @ForeignKey(() => PlantModel)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  plantId: number;

  public static async seed() {
    const seedData: WateringRecordModelSeedData[] =
      await BuildWateringRecordModelSeedData();

    const wateringRecordModels: WateringRecordModel[] = [];
    for (const data of seedData) {
      const wateringRecord: WateringRecordModel =
        await WateringRecordModel.create(data.wateringRecord);
      wateringRecordModels.push(wateringRecord);
    }
    return wateringRecordModels[0];
  }
}
