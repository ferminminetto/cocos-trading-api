import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import Decimal from 'decimal.js';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { AccountRepository } from '../../../accounts/account.repository';
import { MarketDataRepository } from '../../market-data.repository';
import { OrderRepository } from '../../order.repository';
import { ORDER_TYPES, ORDER_STATUS, ORDER_SIDES } from '../../constants/order.constants';
import { OrderHandler } from '../core-handler';
import { Order } from '../../models/order.entity';

/**
 * SELL
 * - Require size > 0.
 * - Validates ownership (netShares >= size) → if not, REJECTED.
 * - LIMIT: uses dto.price → NEW.
 * - MARKET: uses close → FILLED.
 */
@Injectable()
export class SellOrderHandler implements OrderHandler {
  readonly side = ORDER_SIDES.SELL;

  constructor(
    private readonly accounts: AccountRepository,
    private readonly market: MarketDataRepository,
    private readonly orders: OrderRepository,
  ) {}

  async execute(dto: CreateOrderDto, mgr: EntityManager): Promise<Order> {
    if (!dto.instrumentId) throw new BadRequestException('instrumentId is required for SELL');
    if (!dto.size || dto.size <= 0) throw new BadRequestException('Invalid size');

    // Validate user owns enough shares
    const owned = new Decimal(await this.accounts.getNetShares(dto.userId, dto.instrumentId, mgr));
    if (owned.lt(dto.size)) {
      return this.orders.insertOrder(mgr, {
        ...dto,
        side: ORDER_SIDES.SELL,
        status: ORDER_STATUS.REJECTED,
      });
    }

    // Determine price based on order type
    const priceStr =
      dto.type === ORDER_TYPES.LIMIT
        ? dto.price
        : await this.market.getExecPrice(dto.instrumentId, mgr);

    if (!priceStr) throw new BadRequestException('No price');

    // Persist depending on type. New for LIMIT, Filled for MARKET.
    const status = dto.type === ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;
    return this.orders.insertOrder(mgr, {
      ...dto,
      side: ORDER_SIDES.SELL,
      price: priceStr,
      status,
    });
  }
}