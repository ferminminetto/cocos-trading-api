import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { HealthController } from './modules/common/health.controller';
import { LoggerProviderModule } from './common/logger.provider.module';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import { GlobalResponseInterceptor } from './common/response.interceptor';
import { InstrumentModule } from './modules/instruments/instrument.module';
import { AccountModule } from './modules/accounts/account.module';
import { OrderModule } from './modules/orders/order.module';

@Module({
  imports: [
    LoggerProviderModule,
    DatabaseModule,
    InstrumentModule,
    AccountModule,
    OrderModule,
  ],
  controllers: [HealthController],
  providers: [GlobalHttpExceptionFilter, GlobalResponseInterceptor],
})
export class AppModule { }
