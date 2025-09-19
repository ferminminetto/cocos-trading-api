import { DataSource, MoreThan } from 'typeorm';
import { AppDataSource } from '../../db/data-source';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { AccountRepository } from '../accounts/account.repository';
import { MarketDataRepository } from './market-data.repository';
import { CreateOrderDto, } from './dto/create-order.dto';
import { ORDER_STATUS, ORDER_TYPES, ORDER_SIDES } from './constants/order.constants';
import { BadRequestException } from '@nestjs/common';
import { TEST_INSTRUMENT_ID_CURRENCY, TEST_INSTRUMENT_ID_STOCK } from '../../../test/constants';
import { BuyOrderHandler } from './core/handlers/buy.handler';
import { SellOrderHandler } from './core/handlers/sell.handler';
import { CashInHandler } from './core/handlers/cash-in.handler';
import { CashOutHandler } from './core/handlers/cash-out.handler';

/**
 * Integration tests for OrderService.create using the real database.
 * Cleanup strategy: delete all rows in orders with id > 17 after each test.
 */
describe('OrderService (integration)', () => {
  let ds: DataSource;
  let service: OrderService;
  let ordersRepo: OrderRepository;
  let accountRepo: AccountRepository;
  let marketRepo: MarketDataRepository;
  let testUserId: number;

  beforeAll(async () => {
    ds = await AppDataSource.initialize();
    ordersRepo = new OrderRepository(ds);
    accountRepo = new AccountRepository(ds);
    marketRepo = new MarketDataRepository(ds);
    const testLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };

    const buyHandler = new BuyOrderHandler(accountRepo, marketRepo, ordersRepo);
    const sellHandler = new SellOrderHandler(accountRepo, marketRepo, ordersRepo);
    const cashInHandler = new CashInHandler(marketRepo, ordersRepo);
    const cashOutHandler = new CashOutHandler(accountRepo, ordersRepo);

    const handlers = {
      [ORDER_SIDES.BUY]: buyHandler,
      [ORDER_SIDES.SELL]: sellHandler,
      [ORDER_SIDES.CASH_IN]: cashInHandler,
      [ORDER_SIDES.CASH_OUT]: cashOutHandler,
    };

    service = new OrderService(ds, ordersRepo, accountRepo, marketRepo, testLogger, handlers);
  });

  beforeEach(async () => {
    // Create an isolated test user with default values (schema-agnostic)
    const rows = await ds.query(
      `INSERT INTO users DEFAULT VALUES RETURNING id`
    );
    testUserId = rows[0].id;
  });

  afterEach(async () => {
    // Remove all orders created for this test user to avoid FK violations
    if (testUserId) {
      await ordersRepo.delete({ userId: testUserId });
    }

    // Legacy cleanup for any stray test records above seed watermark
    const toDelete = await ordersRepo
      .createQueryBuilder('o')
      .where('o.id > :id', { id: 17 })
      .getMany();
    if (toDelete.length) {
      await ordersRepo.remove(toDelete);
    }

    if (testUserId) {
      await ds.query(`DELETE FROM users WHERE id = $1`, [testUserId]);
    }

    // Cleanup marketdata using TypeORM
    await marketRepo.delete({ id: MoreThan(126) });
  });

  afterAll(async () => {
    await ds.destroy();
  });

  it('BUY MARKET with exact cash -> FILLED, cash=0, net shares=10', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK;   // Existing instrument except currency (MONEDA)

    // Provide a deterministic MARKET price = 100.00
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '100.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // Ensure user has exactly $1000 cash available via a FILLED CASH_IN
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 1000,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.MARKET,
      size: 10,
    };

    // Act
    const created = await service.create(dto);

    // Assert
    expect(created).toBeDefined();
    expect(created.userId).toBe(userId);
    expect(created.instrumentId).toBe(instrumentId);
    expect(created.side).toBe(ORDER_SIDES.BUY);
    expect(created.type).toBe(ORDER_TYPES.MARKET);
    expect(created.size).toBe(10);
    expect(created.status).toBe(ORDER_STATUS.FILLED);
    expect(Number(created.price)).toBe(100);

    const fetched = await ordersRepo.findOne({ where: { id: created.id } });
    expect(fetched).toBeDefined();
    expect(fetched?.status).toBe(ORDER_STATUS.FILLED);

    const cash = await accountRepo.getCashAvailable(userId);
    expect(cash).toBe('0.00');

    const shares = await accountRepo.getNetShares(userId, instrumentId);
    expect(shares).toBe('10');
  });

  it('BUY MARKET without enough cash -> REJECTED, cash and shares remain the same', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK; // Existing instrument except currency (MONEDA)

    // Set up market price
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '100.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // PRECONDITION: user with $500 cash
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 500,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    // ORDER: BUY size=10 (cost = 1000, cash = 500)
    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.MARKET,
      size: 10,
    };

    const created = await service.create(dto);

    // EXPECTED: ORDER REJECTED
    expect(created).toBeDefined();
    expect(created.status).toBe(ORDER_STATUS.REJECTED);

    // EXPECTED: Cash and shares remain the same
    const cash = await accountRepo.getCashAvailable(userId);
    expect(cash).toBe('500');

    const shares = await accountRepo.getNetShares(userId, instrumentId);
    expect(shares).toBe('0');
  });

  it('BUY MARKET using moneyAmount -> FILLED, remaining cash not used, shares=3', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK; // Existing instrument except currency (MONEDA)

    // Set up market price
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '333.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // PRECONDITION: user with $1000 cash
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 1000,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    // ORDER: BUY (cost = 1000, cash = 500)
    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.MARKET,
      moneyAmount: '1000.00', // should buy 3 shares at 333 each
    };

    const created = await service.create(dto);

    // EXPECTED: ORDER FILLED
    expect(created).toBeDefined();
    expect(created.status).toBe(ORDER_STATUS.FILLED);

    // EXPECTED: Cash that wasn't reduced remains (1$), and shares should be 3
    const cash = await accountRepo.getCashAvailable(userId);
    expect(cash).toBe('1.00');

    const shares = await accountRepo.getNetShares(userId, instrumentId);
    expect(shares).toBe('3');
  });

  it('BUY LIMIT -> NEW, cash and positions should remain the same', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK; // Existing instrument except currency (MONEDA)

    // Provide a deterministic MARKET price = 100.00
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '100.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // Ensure user has exactly $1000 cash available via a FILLED CASH_IN
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 1000,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.LIMIT,
      size: 10,
      price: '100.00',
    };

    const created = await service.create(dto);

    // EXPECTED: ORDER NEW without side effects
    expect(created).toBeDefined();
    expect(created.status).toBe(ORDER_STATUS.NEW);

    // EXPECTED: Cash that wasn't deducted remains (1000)
    const cash = await accountRepo.getCashAvailable(userId);
    expect(cash).toBe('1000');
  });

  it('BUY LIMIT without price -> BadRequest', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK; // Existing instrument except currency (MONEDA)

    // Provide a deterministic MARKET price = 100.00

    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.LIMIT,
      size: 10,
    };

    // Check for bad request thrown
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    await expect(service.create(dto)).rejects.toThrow('No price');
  });

  it('SELL MARKET with enough shares -> FILLED, cash=25 (incremented), net shares=1(deducted)', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK;   // Existing instrument except currency (MONEDA)

    // Provide a deterministic MARKET price = 5
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '5.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // Ensure user has exactly $60 cash available via a FILLED CASH_IN
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 60,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });


    // Ensure user has exactly 6 shares available
    await ordersRepo.insert({
      instrumentId,
      userId,
      size: 6,
      price: '10.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.BUY,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.SELL,
      type: ORDER_TYPES.MARKET,
      size: 5,
    };

    // Act
    const created = await service.create(dto);

    // Assert
    expect(created).toBeDefined();
    expect(created.userId).toBe(userId);
    expect(created.instrumentId).toBe(instrumentId);
    expect(created.side).toBe(ORDER_SIDES.SELL);
    expect(created.type).toBe(ORDER_TYPES.MARKET);
    expect(created.size).toBe(5);
    expect(created.status).toBe(ORDER_STATUS.FILLED);
    expect(Number(created.price)).toBe(5);

    const fetched = await ordersRepo.findOne({ where: { id: created.id } });
    expect(fetched).toBeDefined();
    expect(fetched?.status).toBe(ORDER_STATUS.FILLED);

    const cash = await accountRepo.getCashAvailable(userId);
    expect(cash).toBe('25.00');

    const shares = await accountRepo.getNetShares(userId, instrumentId);
    expect(shares).toBe('1');
  });

  it('SELL MARKET without enough shares -> REJECTED, net shares=5(stay the same)', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK;   // Existing instrument except currency (MONEDA)

    // Provide a deterministic MARKET price = 5
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '5.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // Ensure user has exactly $50 cash available via a FILLED CASH_IN
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 50,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });


    // Ensure user has exactly 5 shares available
    await ordersRepo.insert({
      instrumentId,
      userId,
      size: 5,
      price: '10.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.BUY,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.SELL,
      type: ORDER_TYPES.MARKET,
      size: 6,
    };

    // Act
    const created = await service.create(dto);

    // Assert
    expect(created).toBeDefined();
    expect(created.userId).toBe(userId);
    expect(created.instrumentId).toBe(instrumentId);
    expect(created.side).toBe(ORDER_SIDES.SELL);
    expect(created.type).toBe(ORDER_TYPES.MARKET);
    expect(created.size).toBe(6);
    expect(created.status).toBe(ORDER_STATUS.REJECTED);

    const fetched = await ordersRepo.findOne({ where: { id: created.id } });
    expect(fetched).toBeDefined();
    expect(fetched?.status).toBe(ORDER_STATUS.REJECTED);

    // Shares amount untouched
    const shares = await accountRepo.getNetShares(userId, instrumentId);
    expect(shares).toBe('5');

    const newOrder: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.SELL,
      type: ORDER_TYPES.MARKET,
      size: 5,
    };

    // Created another one with the exactly amount of shares the user has
    const createdOrder = await service.create(newOrder);
    expect(createdOrder.status).toBe(ORDER_STATUS.FILLED);

  });

  it('CASH OUT without enough money -> REJECTED, money stays the same', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_CURRENCY;   // Existing currency

    // Ensure user has exactly $50 cash available via a FILLED CASH_IN
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 50,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    const dto: CreateOrderDto = {
      userId,
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      side: ORDER_SIDES.CASH_OUT,
      type: ORDER_TYPES.MARKET,
      size: 51,
    };

    // Act
    const created = await service.create(dto);

    // Assert
    expect(created).toBeDefined();
    expect(created.userId).toBe(userId);
    expect(created.instrumentId).toBe(instrumentId);
    expect(created.side).toBe(ORDER_SIDES.CASH_OUT);
    expect(created.type).toBe(ORDER_TYPES.MARKET);
    expect(created.size).toBe(51);
    expect(created.status).toBe(ORDER_STATUS.REJECTED);

    const fetched = await ordersRepo.findOne({ where: { id: created.id } });
    expect(fetched).toBeDefined();
    expect(fetched?.status).toBe(ORDER_STATUS.REJECTED);

    const newOrder: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.CASH_OUT,
      type: ORDER_TYPES.MARKET,
      size: 50,
    };

    // Created another one with the exactly amount of shares the user has
    const createdOrder = await service.create(newOrder);
    expect(createdOrder.status).toBe(ORDER_STATUS.FILLED);

  });

  it('Getportfolio after a sequence of orders: CASH_IN 1000 → BUY MARKET 5@100 → SELL MARKET 2@120', async () => {
    const userId = testUserId;
    const instrumentId = 20; // existing instrument non-currency

    // INITIAL PRICE = 100 (for BUY)
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '100.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // CASH_IN 1000
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 1000,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    // BUY MARKET 5 @ 100
    await service.create({
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.MARKET,
      size: 5,
    });

    // Refresh price to 120 (for the SELL and as close_actual of the portfolio)
    await marketRepo.save({
      instrumentId,
      high: null,
      low: null,
      open: null,
      close: '120.00',
      previousClose: '100.00',
      date: '2025-01-02',
    });

    // SELL MARKET 2 @ 120
    await service.create({
      userId,
      instrumentId,
      side: ORDER_SIDES.SELL,
      type: ORDER_TYPES.MARKET,
      size: 2,
    });

    // Expected portfolio:
    // cash = 1000 − (5*100) + (2*120) = 740
    // shares = 3
    // positions_value = 3 * currentClose(120) = 360
    // total = 740 + 360 = 1100
    // daily_return = (close/previousClose − 1) * 100 = 20
    const portfolio = await accountRepo.getUserPortfolio(userId);

    expect(Number(portfolio.cash_available)).toBe(740);
    expect(Number(portfolio.positions_value)).toBe(360);
    expect(Number(portfolio.total_value)).toBe(1100);

    expect(portfolio.positions).toHaveLength(1);
    const pos = portfolio.positions[0];
    expect(pos.instrumentId).toBe(instrumentId);
    expect(pos.shares).toBe('3');
    expect(Number(pos.monetaryValue)).toBe(360);
    expect(Number(pos.close)).toBe(120);
    expect(Number(pos.previousClose)).toBe(100);
    expect(Number(pos.dailyReturnPct)).toBeCloseTo(20, 6);
  });

  it('prevents duplicate orders with the same idempotenceKey', async () => {
    const userId = testUserId;
    const instrumentId = TEST_INSTRUMENT_ID_STOCK;
    const idempotenceKey = 'unique-key-123';

    // Seed market price
    await marketRepo.save({
      instrumentId,
      close: '100.00',
      previousClose: '100.00',
      date: '2025-01-01',
    });

    // Seed user cash
    await ordersRepo.insert({
      instrumentId: TEST_INSTRUMENT_ID_CURRENCY,
      userId,
      size: 1000,
      price: '1.00',
      type: ORDER_TYPES.MARKET,
      side: ORDER_SIDES.CASH_IN,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
    });

    // First order should succeed
    const dto: CreateOrderDto = {
      userId,
      instrumentId,
      side: ORDER_SIDES.BUY,
      type: ORDER_TYPES.MARKET,
      size: 1,
      idempotenceKey,
    };

    const created = await service.create(dto);
    expect(created).toBeDefined();
    expect(created.idempotenceKey).toBe(idempotenceKey);

    // Second order with same idempotenceKey should throw
    await expect(service.create(dto)).rejects.toThrow('Duplicate order');
  });
});
