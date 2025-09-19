import { EntityManager } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../models/order.entity';
import { OrderSide } from '../constants/order.constants';

/**
 * Handles the creation of an order of a specific "side" within an already opened transaction.
 * Must validate business rules and persist the result (NEW, FILLED, or REJECTED).
 */
export interface OrderHandler {
  readonly side: OrderSide;
  execute(dto: CreateOrderDto, mgr: EntityManager): Promise<Order>;
}