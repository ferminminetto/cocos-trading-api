import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { HealthController } from './modules/common/health.controller';
import { LoggerProviderModule } from './common/logger.provider.module';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';

@Module({
  imports: [
    LoggerProviderModule,
    DatabaseModule,
  ],
  controllers: [HealthController],
  providers: [GlobalHttpExceptionFilter],
})
export class AppModule { }
