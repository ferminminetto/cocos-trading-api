import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { AccountRepository } from '../accounts/account.repository';
import { MarketDataRepository } from './market-data.repository';
import { BuyOrderHandler } from './core/handlers/buy.handler';
import { SellOrderHandler } from './core/handlers/sell.handler';
import { CashInHandler } from './core/handlers/cash-in.handler';
import { CashOutHandler } from './core/handlers/cash-out.handler';
import { ORDER_SIDES } from './constants/order.constants';
import { ORDER_HANDLERS } from './core/handlers/tokens';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    AccountRepository,
    MarketDataRepository,
    // Concrete strategy implementations
    BuyOrderHandler,
    SellOrderHandler,
    CashInHandler,
    CashOutHandler,
    // Multi-provider: build the array once and inject it by token
    {
      provide: ORDER_HANDLERS,
      useFactory: (
        buy: BuyOrderHandler,
        sell: SellOrderHandler,
        cashIn: CashInHandler,
        cashOut: CashOutHandler,
      ) => ({
        [ORDER_SIDES.BUY]: buy,
        [ORDER_SIDES.SELL]: sell,
        [ORDER_SIDES.CASH_IN]: cashIn,
        [ORDER_SIDES.CASH_OUT]: cashOut,
      }),
      inject: [BuyOrderHandler, SellOrderHandler, CashInHandler, CashOutHandler],
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}