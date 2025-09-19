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
 * BUY
 * - LIMIT: use provided price → NEW (does not execute).
 * - MARKET: use market close price → FILLED.
 * - If size is not provided but moneyAmount is: size = floor(moneyAmount / price).
 * - Validates sufficient funds for BUY (rejects if cost > cash).
 */
@Injectable()
export class BuyOrderHandler implements OrderHandler {
  readonly side = ORDER_SIDES.BUY;

  constructor(
    private readonly accounts: AccountRepository,
    private readonly market: MarketDataRepository,
    private readonly orders: OrderRepository,
  ) {}

  async execute(dto: CreateOrderDto, mgr: EntityManager): Promise<Order> {
    if (!dto.instrumentId) throw new BadRequestException('instrumentId is required for BUY');

    // Determine Price
    const priceStr =
      dto.type === ORDER_TYPES.LIMIT
        ? dto.price
        : await this.market.getExecPrice(dto.instrumentId, mgr);

    if (!priceStr) throw new BadRequestException('No price');
    const price = new Decimal(priceStr);
    if (price.lte(0)) throw new BadRequestException('Invalid price');

    // Determine size
    let size = dto.size ?? 0;
    if (!size) {
      if (!dto.moneyAmount) throw new BadRequestException('Missing size or moneyAmount');
      size = new Decimal(dto.moneyAmount).div(price).floor().toNumber();
      if (size <= 0) throw new BadRequestException('Insufficient funds for at least 1 share');
    }

    // Validate Cash
    const cash = new Decimal(await this.accounts.getCashAvailable(dto.userId, mgr));
    const cost = price.mul(size);
    if (cash.lt(cost)) {
      return this.orders.insertOrder(mgr, {
        ...dto,
        side: ORDER_SIDES.BUY,
        size,
        price: price.toFixed(),
        status: ORDER_STATUS.REJECTED,
      });
    }

    // Persist depending on type.
    const status = dto.type === ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;
    return this.orders.insertOrder(mgr, {
      ...dto,
      side: ORDER_SIDES.BUY,
      size,
      price: price.toFixed(),
      status,
    });
  }
}