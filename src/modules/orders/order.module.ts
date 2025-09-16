import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { AccountRepository } from '../accounts/account.repository';
import { MarketDataRepository } from './market-data.repository';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    AccountRepository,
    MarketDataRepository,
  ],
  exports: [OrderService],
})
export class OrderModule {}