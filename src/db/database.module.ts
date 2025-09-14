import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres',
                    url: config.get<string>('DATABASE_URL'),
                    ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
                    synchronize: false,
                    autoLoadEntities: true,
                    poolSize: 10,
                }
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }