import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { MarketDataRepository } from '../../market-data.repository';
import { OrderRepository } from '../../order.repository';
import { ORDER_TYPES, ORDER_STATUS, ORDER_SIDES } from '../../constants/order.constants';
import { OrderHandler } from '../core-handler';
import { Order } from '../../models/order.entity';

/**
 * CASH_IN
 * - Requires size > 0 (amount to deposit).
 * - LIMIT: uses dto.price → NEW.
 * - MARKET: uses market price (according to your current logic) → FILLED.
 *   Note: if "cash" is a CURRENCY instrument with price=1, this handler can be easily adjusted.
 */
@Injectable()
export class CashInHandler implements OrderHandler {
  readonly side = ORDER_SIDES.CASH_IN;

  constructor(
    private readonly market: MarketDataRepository,
    private readonly orders: OrderRepository,
  ) {}

  async execute(dto: CreateOrderDto, mgr: EntityManager): Promise<Order> {
    if (!dto.size || dto.size <= 0) throw new BadRequestException('Invalid size');

    const priceStr =
      dto.type === ORDER_TYPES.LIMIT
        ? dto.price
        : await this.market.getExecPrice(dto.instrumentId!, mgr);

    if (!priceStr) throw new BadRequestException('No price from market for cash in');

    const status = dto.type === ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;

    return this.orders.insertOrder(mgr, {
      ...dto,
      side: ORDER_SIDES.CASH_IN,
      price: priceStr,
      status,
    });
  }
}