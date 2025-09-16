import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Order } from './models/order.entity';

/**
 * Repository for Orders.
 * - Encapsulates SQL and concurrency details (lock).
 */
@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private readonly ds: DataSource) {
    super(Order, ds.createEntityManager());
  }

  async lockUser(mgr: EntityManager, userId: number): Promise<void> {
    // Lock for transaction: avoids race conditions between orders from the same user
    await mgr.query('SELECT pg_advisory_xact_lock($1)', [userId]);
  }

  async insertOrder(mgr: EntityManager, values: Partial<Order>) {
    const repo = mgr.getRepository(Order);
    const order = repo.create({
      ...values,
      datetime: new Date(),
    });
    return await repo.save(order);
  }
}