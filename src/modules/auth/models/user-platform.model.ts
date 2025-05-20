import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import {
  BuildUserPlatformModelSeedData,
  UserPlatformModelSeedData,
} from 'src/modules/auth/seeds/user-platform.seed';

/**
 * Sequelize model representing a platform on which users access the application
 * (e.g., web, mobile, desktop). This is useful for analytics, segmentation, or
 * user experience optimization across platforms.
 */
@Table
export class UserPlatformModel extends Model<UserPlatformModel> {
  /**
   * Primary key identifier for the user platform record.
   */
  @ApiProperty({
    example: 1,
    description: 'Unique ID of the login record',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  /**
   * The name of the platform (e.g., "Web", "iOS", "Android").
   */
  @ApiProperty({
    example: 'Android',
    description: 'The name of the platform (e.g., "Web", "iOS", "Android").',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  /**
   * Seeds the UserPlatformModel table with initial data.
   * This function is typically used during development or database initialization
   * to populate platform records such as 'Web', 'iOS', 'Android', etc.
   *
   * @returns The first created platform record.
   */
  public static async seed() {
    // Generate the seed data from an external builder function
    const seedData: UserPlatformModelSeedData[] =
      await BuildUserPlatformModelSeedData();

    // Create each user platform entry and store it
    const UserPlatformModels: UserPlatformModel[] = [];
    for (const data of seedData) {
      const userPlatform: UserPlatformModel = await UserPlatformModel.create(
        data.userPlatform,
      );
      UserPlatformModels.push(userPlatform);
    }

    // Return the first seeded model as a representative sample
    return UserPlatformModels[0];
  }
}
