import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BizExpert API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, creates business, and enforces tenant isolation', async () => {
    const email = `e2e-${Date.now()}@test.bizexpert.ng`;
    const password = 'Test1234!';

    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'E2E User', email, password })
      .expect(201);

    expect(reg.body.token).toBeDefined();
    expect(reg.body.businesses).toEqual([]);

    const token = reg.body.token;

    const biz = await request(app.getHttpServer())
      .post('/api/v1/businesses')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'E2E Biz' })
      .expect(201);

    const businessId = biz.body.id;

    await request(app.getHttpServer())
      .get(`/api/v1/businesses/${businessId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const otherEmail = `other-${Date.now()}@test.bizexpert.ng`;
    const other = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Other', email: otherEmail, password })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/api/v1/businesses/${businessId}/products`)
      .set('Authorization', `Bearer ${other.body.token}`)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/api/v1/businesses/${businessId}/analytics/collection-summary`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/v1/businesses/${businessId}/inventory/transfers`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
