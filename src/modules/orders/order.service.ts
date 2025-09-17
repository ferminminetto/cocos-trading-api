import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import Decimal from 'decimal.js';
import { CreateOrderDto, } from './dto/create-order.dto';
import { AccountRepository } from '../accounts/account.repository';
import { MarketDataRepository } from './market-data.repository';
import { OrderRepository } from './order.repository';
import { ORDER_TYPES, ORDER_SIDES, ORDER_STATUS } from './constants/order.constants';

@Injectable()
export class OrderService {
  constructor(
    private readonly ds: DataSource,
    private readonly ordersRepo: OrderRepository,
    private readonly accountRepo: AccountRepository,
    private readonly marketRepo: MarketDataRepository,
  ) { }

  async create(order: CreateOrderDto, idemKey?: string) {
    return this.ds.transaction(async (mgr) => {
      // Lock for user to avoid race conditions (released on commit/rollback)
      await mgr.query('SELECT pg_advisory_xact_lock($1)', [order.userId]);

      // Idempotence key check if received
      if (idemKey) {
        await this.ordersRepo.ensureNotDuplicated(idemKey, mgr);
      }

      // Retrieve necessary data
      const cash = new Decimal(await this.accountRepo.getCashAvailable(order.userId, mgr));
      const shares = order.side === ORDER_SIDES.SELL
        ? new Decimal(await this.accountRepo.getNetShares(order.userId, order.instrumentId!, mgr))
        : new Decimal(0);

      // Business Layer
      if (order.side === ORDER_SIDES.BUY) {
        return await this.buyOrder(order, cash, mgr, idemKey);
      }

      if (order.side === ORDER_SIDES.SELL) {
        return await this.sellOrder(order, shares, mgr, idemKey);
      }

      if (order.side === ORDER_SIDES.CASH_IN) {
        return await this.cashInOrder(order, mgr, idemKey);
      }

      if (order.side === ORDER_SIDES.CASH_OUT) {
        return await this.cashOutOrder(order, cash, mgr, idemKey);
      }

      throw new BadRequestException('Unsupported side');
    });
  }

  // Encapsulates logic for a BUY order.
  private async buyOrder(order: CreateOrderDto, cash: Decimal, mgr: EntityManager, idemKey?: string) {
    // If Order TYPE is LIMIT, use the provided price, otherwise get the current market price
    const priceStr = order.type === ORDER_TYPES.LIMIT ? order.price : await this.marketRepo.getExecPrice(order.instrumentId!, mgr);
    if (!priceStr) throw new BadRequestException('No price');

    const price = new Decimal(priceStr);
    if (price.lte(0)) throw new BadRequestException('Invalid price');

    // If NO SIZE is provided, calculate it from moneyAmount AND the price from the market
    let size = order.size ?? 0;
    if (!size) {
      if (!order.moneyAmount) throw new BadRequestException('Missing size or moneyAmount');
      size = new Decimal(order.moneyAmount).div(price).floor().toNumber();
      if (size <= 0) throw new BadRequestException('Insufficient funds for at least 1 share');
    }

    // Check that the user has enough cash to afford purchase
    const cost = price.mul(size);
    if (cash.lt(cost)) {
      return this.ordersRepo.insertOrder(mgr, {
        ...order, size, price: price.toFixed(), status: ORDER_STATUS.REJECTED,
      });
    }

    // Place the order successfully
    const newStatus = order.type == ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;
    return this.ordersRepo.insertOrder(mgr, {
      ...order, size, price: price.toFixed(), status: newStatus,
    });
  }

  // Encapsulates logic for a SELL order.
  private async sellOrder(order: CreateOrderDto, shares: Decimal, mgr: EntityManager, idemKey?: string) {
    if (!order.size || order.size <= 0) throw new BadRequestException('Invalid size');
    if (shares.lt(order.size)) {
      return this.ordersRepo.insertOrder(mgr, { ...order, status: ORDER_STATUS.REJECTED });
    }

    // If Order is LIMIT then we use the provided price, if not we get the current market price
    const priceStr = order.type === ORDER_TYPES.LIMIT ? order.price : await this.marketRepo.getExecPrice(order.instrumentId!, mgr);
    if (!priceStr) throw new BadRequestException('No price');


    const newStatus = order.type == ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;
    return this.ordersRepo.insertOrder(mgr, { ...order, price: priceStr, status: newStatus });
  }

  // Encapsulates logic for a CASH_IN order.
  private async cashInOrder(order: CreateOrderDto, mgr: EntityManager, idemKey?: string) {
    if (!order.size || order.size <= 0) throw new BadRequestException('Invalid size');

    // If Order is LIMIT then we use the provided price, if not we get the current market price
    const priceStr = order.type === ORDER_TYPES.LIMIT ? order.price : await this.marketRepo.getExecPrice(order.instrumentId!, mgr);
    if (!priceStr) throw new BadRequestException('No price');

    const newStatus = order.type == ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;
    return this.ordersRepo.insertOrder(mgr, { ...order, price: priceStr, status: newStatus });
  }

  private async cashOutOrder(order: CreateOrderDto, cash: Decimal, mgr: EntityManager, idemKey?: string) {
    if (!order.size || order.size <= 0) throw new BadRequestException('Invalid amount');
    if (cash.lt(order.size)) {
      return this.ordersRepo.insertOrder(mgr, { ...order, status: ORDER_STATUS.REJECTED });
    }
    return this.ordersRepo.insertOrder(mgr, { ...order, status: ORDER_STATUS.FILLED });
  }
}