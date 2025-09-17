import { DataSource } from 'typeorm';
import { AccountRepository } from './account.repository';
import { AppDataSource } from '../../db/data-source';
import { Instrument } from '../instruments/models/instrument.entity';
import { Order } from '../orders/models/order.entity';
import { User } from '../accounts/models/user.entity';
import { OrderRepository } from '../orders/order.repository';
import { ORDER_SIDES, ORDER_STATUS, ORDER_TYPES } from '../orders/constants/order.constants';
import { TEST_INSTRUMENT_ID_CURRENCY } from '../../../test/constants';

describe('AccountRepository (integration)', () => {
  let ds: DataSource;
  let repo: AccountRepository;
  let ordersRepo: OrderRepository;

  beforeAll(async () => {
    ds = await AppDataSource.initialize(); // TEST_DATABASE_URL
    repo = new AccountRepository(ds);
    ordersRepo = new OrderRepository(ds);
  });

  afterAll(async () => {
    await ds.destroy();
  });

  it('computes portfolio for user 1 (seeded from original data)', async () => {
    const row = await repo.getUserPortfolio(1);

    expect(row.cash_available).toBe('753000.00');
    expect(row.positions_value).toBe('151784.00');
    expect(row.total_value).toBe('904784.00');

    expect(row.positions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ticker: 'METR', shares: '500' }),
        expect.objectContaining({ ticker: 'PAMP', shares: '40' }),
      ]),
    );
  });

  it('ignores CANCELLED/REJECTED in cash and positions', async () => {
    const instrumentId = TEST_INSTRUMENT_ID_CURRENCY; // existing instrument non-currency
    await ordersRepo.insert({
      userId: 2,
      instrumentId,
      side: ORDER_SIDES.CASH_IN,
      type: ORDER_TYPES.MARKET,
      status: ORDER_STATUS.CANCELLED,
      size: 200,
    });
    let row = await repo.getUserPortfolio(2);
    expect(row.cash_available).toBe('0');

    const orderCreated = await ordersRepo.insert({
      userId: 2,
      instrumentId,
      side: ORDER_SIDES.CASH_IN,
      type: ORDER_TYPES.MARKET,
      status: ORDER_STATUS.FILLED,
      size: 200,
    });
    row = await repo.getUserPortfolio(2);
    expect(row.cash_available).toBe('200');



  });
});
