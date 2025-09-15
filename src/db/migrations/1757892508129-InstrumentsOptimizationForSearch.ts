import { MigrationInterface, QueryRunner } from 'typeorm';

export class InstrumentsSearchIndexesSafe1757890000000 implements MigrationInterface {

  public async up(qr: QueryRunner): Promise<void> {
    await qr.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // Creating indexes
    await qr.query(`
      CREATE INDEX IF NOT EXISTS idx_instruments_ticker_trgm
      ON instruments USING gin (ticker gin_trgm_ops);
    `);

    await qr.query(`
      CREATE INDEX IF NOT EXISTS idx_instruments_name_trgm
      ON instruments USING gin (name gin_trgm_ops);
    `);

    // for match case insensitive searches
    await qr.query(`
      CREATE INDEX IF NOT EXISTS idx_instruments_ticker_lower_btree
      ON instruments (lower(ticker));
    `);
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP INDEX IF EXISTS idx_instruments_ticker_lower_btree;`);
    await qr.query(`DROP INDEX IF EXISTS idx_instruments_name_trgm;`);
    await qr.query(`DROP INDEX IF EXISTS idx_instruments_ticker_trgm;`);
  }
}