import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order } from '../modules/orders/models/order.entity';
import { Instrument } from '../modules/instruments/models/instrument.entity';
import { MarketData } from '../modules/instruments/models/market-data.entity';
import { User } from '../modules/accounts/models/user.entity';

// Detect execution context to decide whether to load TS or JS files
// - When running the app (Nest start), avoid loading TS migrations to prevent ESM parser errors
// - When using the TypeORM CLI (migration:run/generate), allow TS migrations
const isTsRuntime = __filename.endsWith('.ts') || __dirname.includes('src');
const isTestRuntime = !!process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test';
const dbUrl =
  (isTestRuntime && process.env.TEST_DATABASE_URL)
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,

  entities: [
    Order, Instrument, MarketData, User,
    ...(isTsRuntime ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js']),
  ],
  migrations: ['src/db/migrations/*.ts', 'dist/db/migrations/*.js'],

});