import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { HealthController } from './modules/common/health.controller';
import { LoggerProviderModule } from './common/logger.provider.module';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import { GlobalResponseInterceptor } from './common/response.interceptor';
import { InstrumentModule } from './modules/instruments/instrument.module';

@Module({
  imports: [
    LoggerProviderModule,
    DatabaseModule,
    InstrumentModule,
  ],
  controllers: [HealthController],
  providers: [GlobalHttpExceptionFilter, GlobalResponseInterceptor],
})
export class AppModule { }
