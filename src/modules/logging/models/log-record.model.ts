import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class LogRecord extends Model<LogRecord> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id?: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  level: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  service: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  error?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  message?: string;
}
