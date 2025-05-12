import { Column, DataType, Model, Table } from 'sequelize-typescript';
import {
  PlantModelSeedData,
  BuildPlantModelSeedData,
} from '../seeds/plant.seed';

@Table
export class PlantModel extends Model<PlantModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @Column(DataType.TEXT)
  name: string;

  public static async seed() {
    const seedData: PlantModelSeedData[] = await BuildPlantModelSeedData();

    const plantModels: PlantModel[] = [];
    for (const data of seedData) {
      const plant: PlantModel = await PlantModel.create(data.plant);
      plantModels.push(plant);
    }
    return plantModels[0];
  }
}
