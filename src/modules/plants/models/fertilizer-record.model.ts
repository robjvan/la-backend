import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  BuildFertilizerRecordModelSeedData,
  FertilizerRecordModelSeedData,
} from '../seeds/fertilizer-record.seed';
import { PlantModel } from './plant.model';

@Table
export class FertilizerRecordModel extends Model<FertilizerRecordModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @ForeignKey(() => PlantModel)
  @Column(DataType.INTEGER)
  plantId: number;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.TEXT)
  amount?: string;

  @Column(DataType.TEXT)
  brand?: string;

  @Column(DataType.TEXT)
  notes?: string;

  public static async seed() {
    const seedData: FertilizerRecordModelSeedData[] =
      await BuildFertilizerRecordModelSeedData();

    const fertilizerRecords: FertilizerRecordModel[] = [];
    for (const data of seedData) {
      const fertilizerRecord: FertilizerRecordModel =
        await FertilizerRecordModel.create(data.fertilizerRecord);
      fertilizerRecords.push(fertilizerRecord);
    }
    return fertilizerRecords[0];
  }
}
