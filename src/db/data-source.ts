
import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Detect execution context to decide whether to load TS or JS files
// - When running the app (Nest start), avoid loading TS migrations to prevent ESM parser errors
// - When using the TypeORM CLI (migration:run/generate), allow TS migrations
const isTsRuntime = __filename.endsWith('.ts') || __dirname.includes('src');
const isTypeOrmCli = process.argv.some((arg) => arg.includes('typeorm'));

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,
  // Ensure entities are available both in TS dev and JS prod builds
  entities: isTsRuntime ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
  // Only load migrations in CLI context; at app runtime this must be empty to avoid TS import issues
  migrations: isTypeOrmCli
    ? isTsRuntime
      ? ['src/db/migrations/*.ts']
      : ['dist/db/migrations/*.js']
    : [],
});