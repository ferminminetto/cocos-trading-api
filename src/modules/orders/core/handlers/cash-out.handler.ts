import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import Decimal from 'decimal.js';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { AccountRepository } from '../../../accounts/account.repository';
import { OrderRepository } from '../../order.repository';
import { ORDER_STATUS, ORDER_SIDES } from '../../constants/order.constants';
import { OrderHandler } from '../core-handler';
import { Order } from '../../models/order.entity';

/**
 * CASH_OUT
 * - Requiere size > 0 (monto a extraer).
 * - Valida cash disponible (rechaza si insuficiente).
 * - No usa price (tu implementación actual no lo requiere) → FILLED si alcanza el cash.
 */
@Injectable()
export class CashOutHandler implements OrderHandler {
  readonly side = ORDER_SIDES.CASH_OUT;

  constructor(
    private readonly accounts: AccountRepository,
    private readonly orders: OrderRepository,
  ) {}

  async execute(dto: CreateOrderDto, mgr: EntityManager): Promise<Order> {
    if (!dto.size || dto.size <= 0) throw new BadRequestException('Invalid amount');

    const cash = new Decimal(await this.accounts.getCashAvailable(dto.userId, mgr));
    if (cash.lt(dto.size)) {
      return this.orders.insertOrder(mgr, {
        ...dto,
        side: ORDER_SIDES.CASH_OUT,
        status: ORDER_STATUS.REJECTED,
      });
    }

    return this.orders.insertOrder(mgr, {
      ...dto,
      side: ORDER_SIDES.CASH_OUT,
      status: ORDER_STATUS.FILLED,
    });
  }
}