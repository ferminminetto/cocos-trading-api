import { Injectable, BadRequestException, Inject } from '@nestjs/common';
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
    @Inject('LOGGER') private readonly logger: any,
  ) { }

  /**
   * Creates an order (BUY/SELL/CASH_IN/CASH_OUT).
   * Handles idempotency to avoid duplicates, locking to prevent race conditions and double spend, and business logic.
   */
  async create(order: CreateOrderDto) {
    const startedAt = Date.now();
    const ctxBase = {
      userId: order.userId,
      side: order.side,
      type: order.type,
      instrumentId: order.instrumentId,
      size: order.size,
      moneyAmount: order.moneyAmount,
      price: order.price,
      idempotenceKey: order.idempotenceKey,
    };

    this.logger.info({ msg: 'order.create.request', ...ctxBase });

    try {
      const result = await this.ds.transaction(async (mgr) => {
        // Lock (avoids race conditions)
        await mgr.query('SELECT pg_advisory_xact_lock($1)', [order.userId]);

        // Idempotency
        if (order.idempotenceKey) {
          await this.ordersRepo.ensureNotDuplicated(order.idempotenceKey, mgr);
          this.logger.info({ msg: 'order.idempotence.checked', idempotenceKey: order.idempotenceKey, userId: order.userId });
        }

        const cash = new Decimal(await this.accountRepo.getCashAvailable(order.userId, mgr));
        const shares = order.side === ORDER_SIDES.SELL
          ? new Decimal(await this.accountRepo.getNetShares(order.userId, order.instrumentId!, mgr))
          : new Decimal(0);

        this.logger.info({
            msg: 'order.resources.loaded',
            userId: order.userId,
            cash: cash.toString(),
            shares: shares.toString(),
            side: order.side,
            instrumentId: order.instrumentId
        });

        let created: any;

        if (order.side === ORDER_SIDES.BUY) {
          this.logger.info({ msg: 'order.branch.buy', ...ctxBase, cash: cash.toString() });
          created = await this.buyOrder(order, cash, mgr);
        } else if (order.side === ORDER_SIDES.SELL) {
          this.logger.info({ msg: 'order.branch.sell', ...ctxBase, shares: shares.toString() });
          created = await this.sellOrder(order, shares, mgr);
        } else if (order.side === ORDER_SIDES.CASH_IN) {
          this.logger.info({ msg: 'order.branch.cash_in', ...ctxBase });
          created = await this.cashInOrder(order, mgr);
        } else if (order.side === ORDER_SIDES.CASH_OUT) {
          this.logger.info({ msg: 'order.branch.cash_out', ...ctxBase, cash: cash.toString() });
          created = await this.cashOutOrder(order, cash, mgr);
        } else {
          this.logger.warn({ msg: 'order.branch.unsupported', ...ctxBase });
          throw new BadRequestException('Unsupported side');
        }

        this.logger.info({
          msg: 'order.persisted',
          orderId: created.id,
          status: created.status,
          side: created.side,
          type: created.type,
          price: created.price,
          size: created.size,
          idempotenceKey: created.idempotenceKey,
        });

        return created;
      });

      const durationMs = Date.now() - startedAt;
      this.logger.info({
        msg: 'order.create.success',
        orderId: result.id,
        status: result.status,
        userId: result.userId,
        side: result.side,
        durationMs
      });
      return result;
    } catch (err: any) {
      const durationMs = Date.now() - startedAt;
      this.logger.error({
        msg: 'order.create.failed',
        error: err.message,
        stack: err.stack,
        ...ctxBase,
        durationMs
      });
      throw err;
    }
  }

  // Encapsulates logic for a BUY order.
  private async buyOrder(order: CreateOrderDto, cash: Decimal, mgr: EntityManager) {
    // If Order TYPE is LIMIT, use the provided price, otherwise get the current market price
    const priceStr = order.type === ORDER_TYPES.LIMIT ? order.price : await this.marketRepo.getExecPrice(order.instrumentId!, mgr);
    // IF no price is found and the order is not CASH_IN or CASH_OUT (currencies), throw error
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
  private async sellOrder(order: CreateOrderDto, shares: Decimal, mgr: EntityManager) {
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
  private async cashInOrder(order: CreateOrderDto, mgr: EntityManager) {
    if (!order.size || order.size <= 0) throw new BadRequestException('Invalid size');

    // If Order is LIMIT then we use the provided price, if not we get the current market price
    const priceStr = order.type === ORDER_TYPES.LIMIT ? order.price : await this.marketRepo.getExecPrice(order.instrumentId!, mgr);
    if (!priceStr) throw new BadRequestException('No price from market for cash in');

    const newStatus = order.type == ORDER_TYPES.LIMIT ? ORDER_STATUS.NEW : ORDER_STATUS.FILLED;
    return this.ordersRepo.insertOrder(mgr, { ...order, price: priceStr, status: newStatus });
  }

  private async cashOutOrder(order: CreateOrderDto, cash: Decimal, mgr: EntityManager) {
    if (!order.size || order.size <= 0) throw new BadRequestException('Invalid amount');
    if (cash.lt(order.size)) {
      return this.ordersRepo.insertOrder(mgr, { ...order, status: ORDER_STATUS.REJECTED });
    }
    return this.ordersRepo.insertOrder(mgr, { ...order, status: ORDER_STATUS.FILLED });
  }
}