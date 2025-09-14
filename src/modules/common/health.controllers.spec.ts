import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from './health.controller';
import { AppModule } from '../../app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) should return status OK', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    console.log("EXECUTING");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});