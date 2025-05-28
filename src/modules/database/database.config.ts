import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';

dotenv.config();

export const devConfig: Sequelize = new Sequelize(
  process.env.DB_NAME_DEV,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    ssl: true,
    // clientMinMessages: 'notice',
    logging: false,
  },
);

export const testConfig: Sequelize = new Sequelize(
  process.env.DB_NAME_TEST,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    ssl: true,
    // clientMinMessages: 'notice',
    logging: false,
  },
);

export const prodConfig: Sequelize = new Sequelize(
  process.env.DB_NAME_PROD,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    ssl: true,
    // clientMinMessages: 'notice',
    logging: false,
  },
);
