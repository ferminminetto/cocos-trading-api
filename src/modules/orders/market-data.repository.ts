import { Injectable } from '@nestjs/common';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { MarketData } from '../instruments/models/market-data.entity';

@Injectable()
export class MarketDataRepository extends Repository<MarketData> {
  constructor(private readonly ds: DataSource) {
    super(MarketData, ds.createEntityManager());
  }

  async getExecPrice(instrumentId: number, mgr?: EntityManager): Promise<string | null> {
    const repo = mgr ? mgr.getRepository(MarketData) : this;
    const rows = await repo.find({
      where: { instrumentId },
      order: { date: 'DESC' },
      take: 1,
    });
    return rows.length ? rows[0].close : null;
  }
}