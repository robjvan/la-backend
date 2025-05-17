import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  PlantModelSeedData,
  BuildPlantModelSeedData,
} from '../seeds/plant.seed';
import { UserModel } from 'src/modules/users/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class PlantModel extends Model<PlantModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  @ApiProperty({
    name: 'id',
    required: false,
    description: 'The unique identifier for the plant.',
    example: 1,
  })
  id?: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  @ApiProperty({
    name: 'name',
    required: true,
    description: 'User-assigned name for the plant.',
    example: 'Fiddle Leaf',
  })
  name: string; // User-assigned name (e.g., “Fiddle Leaf”, “My Snake Plant”).

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({
    name: 'userId',
    required: true,
    description: 'ID of the user associated with the plant.',
    example: 1,
  })
  userId: number; // User ID the plant is associated with.

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({
    name: 'imageUrls',
    required: true,
    description: 'List of Firebase Storage URLs to photos.',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
  })
  imageUrls: string[]; // List of Firebase Storage URLs to photos.

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiProperty({
    name: 'species',
    required: false,
    description: 'Common or scientific name (optional).',
    example: '',
  })
  species?: string; // (Optional) ID of the common or scientific name.

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiProperty({
    name: 'location',
    required: false,
    description:
      'Where the plant lives (e.g., “Living Room”, “Kitchen Window”).',
    example: 'Living Room',
  })
  location?: string; // Where the plant lives (e.g., “Living Room”, “Kitchen Window”).

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({
    name: 'notes',
    required: true,
    description: 'Optional user notes.',
    example: ['Getting brown tips', 'Repotted on May 1st.'],
  })
  notes: string[]; // Optional user notes, e.g., “Getting brown tips” or “Repotted on May 1st.”

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({
    name: 'waterIntervalDays',
    required: true,
    description: 'How often to water, in days. Used for reminders.',
    example: 7,
  })
  waterIntervalDays: number; // How often to water, in days. Used for reminders.

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiProperty({
    name: 'lastWateredAt',
    required: false,
    description: 'The last time the plant was watered.',
    example: '2023-10-05T14:30:00Z',
  })
  lastWateredAt?: Date; // The last time the plant was watered.

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  @ApiProperty({
    name: 'reminderEnabled',
    required: true,
    description: 'Whether to receive watering reminders for this plant.',
    example: true,
  })
  reminderEnabled: boolean; // Whether to receive watering reminders for this plant.

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiProperty({
    name: 'humidityPreference',
    required: false,
    description: 'e.g., "Low", "Medium", "High".',
    example: 'Medium',
  })
  humidityPreference?: string; // e.g., "Low", "Medium", "High".

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiProperty({
    name: 'sunlightPreference',
    required: false,
    description: 'e.g., "Full sun", "Indirect light", "Low light".',
    example: 'Indirect light',
  })
  sunlightPreference?: string; // e.g., "Full sun", "Indirect light", "Low light".

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiProperty({
    name: 'soilType',
    required: false,
    description: 'e.g., "Well-draining", "Cactus mix".',
    example: 'Well-draining',
  })
  soilType?: string; // e.g., "Well-draining", "Cactus mix".

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiProperty({
    name: 'fertilierIntervalDays',
    required: false,
    description: 'Optional fertilizing reminder interval.',
    example: 30,
  })
  fertilierIntervalDays?: number; // Optional fertilizing reminder interval.

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiProperty({
    name: 'lastFertilizedAt',
    required: false,
    description: 'Last fertilized timestamp.',
    example: '2023-10-05T14:30:00Z',
  })
  lastFertilizedAt?: Date; // Last fertilized timestamp.

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({
    name: 'tags',
    required: true,
    description: 'User-defined tags like “Succulent”, “Indoor”, “Gift”.',
    example: ['Succulent', 'Indoor'],
  })
  tags: string[]; // User-defined tags like “Succulent”, “Indoor”, “Gift”.

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  archived: boolean; // Marks plant as no longer active (e.g., if it died).

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
