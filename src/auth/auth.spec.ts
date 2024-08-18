import { TestData, cleanup, setup } from '@test/setup';
import * as request from 'supertest';
import { verify } from 'jsonwebtoken';

describe('Authentication', () => {
  let data: TestData;

  beforeAll(async () => (data = await setup('auth')));

  afterAll(() => cleanup());

  describe('root', () => {
    it('should return a 400 if no credentials are provided', () => {
      return request(data.app.getHttpServer()).post('/auth/login').expect(400);
    });

    it('should return a 401 with the wrong credentials', () => {
      return request(data.app.getHttpServer())
        .post('/auth/login')
        .send('name=test&password=wrongpassword')
        .expect(401);
    });

    it('should be able to get an accessToken with the right credentials', () => {
      const tokenSecret = process.env.TOKEN_SECRET;

      return request(data.app.getHttpServer())
        .post('/auth/login')
        .send('name=test&password=test')
        .then((response) => {
          const accessToken = response.body.accessToken;
          expect(accessToken).toBeDefined();

          expect(
            () =>
              verify(accessToken, tokenSecret) as {
                data: {
                  id: string;
                  name: string;
                };
              },
          ).not.toThrow();
        });
    });

    it('Requesting a protected route without a token should return a 401', () => {
      return request(data.app.getHttpServer()).get('/animals').expect(401);
    });
  });
});
