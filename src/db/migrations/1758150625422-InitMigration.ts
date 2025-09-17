import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1758150625422 implements MigrationInterface {
    name = 'InitMigration1758150625422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_instrumentid_fkey"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_userid_fkey"`);
        await queryRunner.query(`ALTER TABLE "marketdata" DROP CONSTRAINT "marketdata_instrumentid_fkey"`);
        await queryRunner.query(`DROP INDEX "public"."idx_instruments_ticker_trgm"`);
        await queryRunner.query(`DROP INDEX "public"."idx_instruments_name_trgm"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accountnumber"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "accountNumber" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "userid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "side" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instruments" DROP COLUMN "ticker"`);
        await queryRunner.query(`ALTER TABLE "instruments" ADD "ticker" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instruments" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "instruments" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instruments" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "instruments" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "marketdata" ALTER COLUMN "instrumentid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_5f3e2f530c164243c140e751c51" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "marketdata" ADD CONSTRAINT "FK_ebc100dd8ce970a0eeb7b2a1355" FOREIGN KEY ("instrumentid") REFERENCES "instruments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketdata" DROP CONSTRAINT "FK_ebc100dd8ce970a0eeb7b2a1355"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_5f3e2f530c164243c140e751c51"`);
        await queryRunner.query(`ALTER TABLE "marketdata" ALTER COLUMN "instrumentid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instruments" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "instruments" ADD "type" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "instruments" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "instruments" ADD "name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "instruments" DROP COLUMN "ticker"`);
        await queryRunner.query(`ALTER TABLE "instruments" ADD "ticker" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "side" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "userid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "accountnumber" character varying(20)`);
        await queryRunner.query(`CREATE INDEX "idx_instruments_name_trgm" ON "instruments" ("name") `);
        await queryRunner.query(`CREATE INDEX "idx_instruments_ticker_trgm" ON "instruments" ("ticker") `);
        await queryRunner.query(`ALTER TABLE "marketdata" ADD CONSTRAINT "marketdata_instrumentid_fkey" FOREIGN KEY ("instrumentid") REFERENCES "instruments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "orders_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "orders_instrumentid_fkey" FOREIGN KEY ("instrumentid") REFERENCES "instruments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
