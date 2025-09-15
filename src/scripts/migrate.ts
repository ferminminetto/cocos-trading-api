import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../db/data-source';

(async () => {
  try {
    const ds = await AppDataSource.initialize();
    const res = await ds.runMigrations();
    console.log('Migrations applied:', res.length);
    await ds.destroy();
    process.exit(0);
  } catch (e) {
    console.error('Migrations failed:', e);
    process.exit(1);
  }
})();