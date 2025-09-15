import { DataSource } from 'typeorm';
import { AccountRepository } from './account.repository';
import { AppDataSource } from '../../db/data-source';

describe('AccountRepository (integration)', () => {
  let ds: DataSource;
  let repo: AccountRepository;

  beforeAll(async () => {
    ds = await AppDataSource.initialize(); // uses TEST_DATABASE_URL
    repo = new AccountRepository(ds);
  });

  afterAll(async () => {
    await ds.destroy();
  });

  it('computes portfolio for user 1', async () => {
    const row = await repo.getUserPortfolio(1);

    expect(row.cash_available).toBe('753000.00');  // según tu cálculo
    expect(row.positions_value).toBe('151784.00');
    expect(row.total_value).toBe('904784.00');

    expect(row.positions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ticker: 'METR', shares: '500' }),
        expect.objectContaining({ ticker: 'PAMP', shares: '40' }),
      ]),
    );
  });

  it('returns cash only for user 2', async () => {
    const row = await repo.getUserPortfolio(2);
    expect(row.cash_available).toBe('100.00');
    expect(row.positions_value).toBe('185170.00');
    expect(row.total_value).toBe('185270.00');
    expect(row.positions[0]).toEqual(expect.objectContaining({ ticker: 'PAMP', shares: '200' }));
  });

  it('ignores CANCELLED/REJECTED in cash and positions', async () => {
    const row = await repo.getUserPortfolio(2);
    expect(row.cash_available).toBe('100.00'); 
  });
});