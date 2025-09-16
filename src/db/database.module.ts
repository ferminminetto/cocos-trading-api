import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './data-source';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get<string>('DATABASE_URL'),
                ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
                synchronize: false,
                autoLoadEntities: true,
                poolSize: 10,
            }),
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