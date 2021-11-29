import request from 'supertest';

import app from '../../app';
import prisma from '../../config/db';
import { clearData } from '../helpers';

beforeAll(async () => await prisma.$connect());
afterAll(async () => {
  await prisma.$disconnect();
  await clearData();
});
beforeEach(async () => await clearData());

describe('Users', () => {
  describe('GET /users', () => {
    test('when have no users in the list, then returns an empty array', async () => {
      const response = await request(app).get('/users');

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual([]);
    });

    test('when have users in the list, returns a list of users', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@doe.co[m',
        password: '123456'
      };

      await prisma.user.create({ data });
      const response = await request(app).get('/users');

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          })
        ])
      );
    });
  });

  describe('GET /users/:id', () => {
    test('when user is not found, returns a 404', async () => {
      const response = await request(app).get('/users/1');

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('No User found');
    });

    test('when user is found, returns a user', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456'
      };
      const user = await prisma.user.create({ data });

      const response = await request(app).get(`/users/${user.id}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('Post /users', () => {
    test('when send correct data, then create a new user', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456'
      };

      const response = await request(app).post('/users').send(data);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toEqual({
        id: expect.any(Number),
        name: data.name,
        email: data.email,
        password: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
      expect(response.statusCode).toEqual(201);
    });

    test("when the email isn't unique, then return a validation error", async () => {
      const data = {
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456'
      };
      await prisma.user.create({ data });

      const response = await request(app).post('/users').send(data);

      expect(response.body.errors).toEqual('email should be unique.');
      expect(response.statusCode).toEqual(422);
    });

    test('when the email is missing, then return a validation error', async () => {
      const errors = ['"email" is required'];
      const data = { name: 'John Doe', password: '123456' };

      const response = await request(app).post('/users').send(data);

      expect(response.body.errors).toEqual(errors);
      expect(response.statusCode).toEqual(422);
    });

    test('when the password is missing, then return a vliadation error', async () => {
      const errors = ['"password" is required'];
      const data = { name: 'John Doe', email: 'john@example.com' };

      const response = await request(app).post('/users').send(data);

      expect(response.body.errors).toEqual(errors);
      expect(response.statusCode).toEqual(422);
    });

    test('when password and email are missing, then return a vliadation error', async () => {
      const errors = ['"email" is required', '"password" is required'];
      const data = { name: 'John Doe' };

      const response = await request(app).post('/users').send(data);

      expect(response.body.errors).toEqual(errors);
      expect(response.statusCode).toEqual(422);
    });
  });

  describe('POST /login', () => {
    test('when has an account, then make a login', async () => {
      const data = {
        email: 'jhon@doe.com',
        password: '123456'
      };

      await request(app).post('/users').send(data);
      const response = await request(app).post('/login').send(data);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toEqual({ token: expect.any(String) });
    });

    test('when has no account, then returns an credentials error', async () => {
      const data = {
        email: 'jhon@doe.com',
        password: '123456'
      };

      const response = await request(app).post('/login').send(data);

      expect(response.body.errors).toEqual('Invalid credentials');
    });
  });

  describe('GET /profile', () => {
    test('when the user is authenticated, then returns the profile info', async () => {
      const data = {
        email: 'john@doe.com',
        password: '123456'
      };
      // Create a user
      await request(app).post('/users').send(data);
      // login
      const response = await request(app).post('/login').send(data);
      // get profile
      const responseProfile = await await request(app)
        .get('/profile')
        .set('x-access-token', response.body.data.token);

      expect(responseProfile.body.errors).toBeUndefined();
      expect(responseProfile.body.data).toEqual({
        user: {
          email: data.email,
          exp: expect.any(Number),
          iat: expect.any(Number)
        }
      });
    });
  });
});
