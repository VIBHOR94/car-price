import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthenticationSystem (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'my_random_email1234@gmail.com',
        password: 'some_password@123',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBeDefined();
      });
  });

  it('signus up as a new user and the gets the current user', async () => {
    const email = 'my_new_mail@somedomain.com';
    const password = 'some_password_123';

    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie) // Attaching cookie to next request
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
