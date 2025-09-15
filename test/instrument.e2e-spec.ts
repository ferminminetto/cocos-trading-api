import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/instruments/search (GET) should return results', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/instruments/search?search=CA&page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.pagination.page).toBeDefined();
    expect(res.body.pagination.total).toBeDefined();
    expect(res.body.pagination.pageSize).toBeDefined();
  });

  it('/api/instruments/search (GET) should return empty for short search', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/instruments/search?search=A');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(0);
  });

  it('/api/instruments/search paginates results', async () => {
    const res1 = await request(app.getHttpServer())
      .get('/api/instruments/search?search=CA&page=1&pageSize=3');
    expect(res1.status).toBe(200);
    expect(res1.body.items.length).toBeLessThanOrEqual(3);

    const res2 = await request(app.getHttpServer())
      .get('/api/instruments/search?search=CA&page=2&pageSize=3');
    expect(res2.status).toBe(200);
    expect(res2.body.items.length).toBeLessThanOrEqual(3);

    // Ensure different pages return different items (if enough results)
    if (res1.body.items.length > 0 && res2.body.items.length > 0) {
      expect(res1.body.items[0].id).not.toBe(res2.body.items[0].id);
    }
  });

  it('/api/instruments/search matches by ticker and name', async () => {
    // By ticker
    const resTicker = await request(app.getHttpServer())
      .get('/api/instruments/search?search=DYCA');
    expect(resTicker.status).toBe(200);
    expect(resTicker.body.items.some(i => i.ticker === 'DYCA')).toBe(true);

    // By name
    const resName = await request(app.getHttpServer())
      .get('/api/instruments/search?search=Capex');
    expect(resName.status).toBe(200);
    expect(resName.body.items.some(i => i.name.includes('Capex'))).toBe(true);
  });
});