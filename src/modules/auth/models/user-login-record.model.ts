import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CountryModel } from 'src/modules/locations/models/country.model';
import { UserModel } from 'src/modules/users/models/user.model';

/**
 * Represents a single user login record, storing the time and origin of a login attempt.
 * This is useful for auditing, geolocation analysis, security monitoring, and analytics.
 */
@Table
export class UserLoginRecordModel extends Model<UserLoginRecordModel> {
  /**
   * Unique identifier for the login record (primary key).
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
   * ID of the user who logged in.
   */
  @ApiProperty({
    example: 42,
    description: 'ID of the user who performed the login',
  })
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  /**
   * Timestamp of the login event.
   */
  @ApiProperty({
    example: '2024-05-01T14:35:00.000Z',
    description: 'Date and time when the login occurred',
  })
  @Column(DataType.DATE)
  timestamp: Date;

  /**
   * ID of the country from which the login originated.
   */
  @ApiProperty({
    example: 2,
    description:
      'ID of the country where the login originated (mapped from IP address)',
  })
  @ForeignKey(() => CountryModel)
  @Column(DataType.INTEGER)
  countryId: number;

  /**
   * IP address used during the login.
   */
  @ApiProperty({
    example: '192.168.1.100',
    description: 'IP address used for the login',
  })
  @Column(DataType.TEXT)
  ipAddress: string;

  // public static async seed() {
  //   const seedData: UserLoginRecordModelSeedData[] =
  //     await BuildUserLoginRecordModelSeedData();

  //   const UserLoginRecordModels: UserLoginRecordModel[] = [];
  //   for (const data of seedData) {
  //     const UserLoginRecordModel: UserLoginRecordModel =
  //       await UserLoginRecordModel.create(data.UserLoginRecordModel);
  //     UserLoginRecordModels.push(UserLoginRecordModel);
  //   }
  //   return UserLoginRecordModels[0];
  // }
}
