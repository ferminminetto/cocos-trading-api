import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './data-source';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                const isTest = !!process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test';
                const url = isTest && process.env.TEST_DATABASE_URL
                  ? process.env.TEST_DATABASE_URL
                  : config.get<string>('DATABASE_URL');

                return {
                    type: 'postgres',
                    url,
                    ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
                    synchronize: false,
                    autoLoadEntities: true,
                    poolSize: 10,
                };
            },
            // Ensure Nest uses the same singleton DataSource (AppDataSource)
            async dataSourceFactory(options) {
                if (!AppDataSource.isInitialized) await AppDataSource.initialize();
                return AppDataSource;
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }