
import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,
  entities: isProd ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
  migrations: isProd ? ['dist/db/migrations/*.js'] : ['src/db/migrations/*.ts'],
});