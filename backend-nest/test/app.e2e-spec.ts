import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

describe('Posts API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  it('GET /posts', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);

        if (response.body.data.length > 0) {
          expect(response.body.data[0]).toEqual(
            expect.objectContaining({
              commentCount: expect.any(Number),
            }),
          );
        }
      });
  });

  it('GET /posts?page=1&limit=6', () => {
    return request(app.getHttpServer())
      .get('/posts?page=1&limit=6')
      .expect(200)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(
          expect.objectContaining({
            items: expect.any(Array),
            pagination: expect.objectContaining({
              page: 1,
              limit: 6,
              totalItems: expect.any(Number),
              totalPages: expect.any(Number),
              hasNextPage: expect.any(Boolean),
              hasPreviousPage: expect.any(Boolean),
            }),
          }),
        );

        if (response.body.data.items.length > 0) {
          expect(response.body.data.items[0]).toEqual(
            expect.objectContaining({
              commentCount: expect.any(Number),
            }),
          );
        }
      });
  });

  it('GET /posts?page=1&limit=6&search=primer', () => {
    return request(app.getHttpServer())
      .get('/posts?page=1&limit=6&search=primer')
      .expect(200)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.items)).toBe(true);
        expect(response.body.data.pagination.page).toBe(1);
        expect(response.body.data.pagination.limit).toBe(6);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
