const request = require('supertest');
const app = require('../app');

describe('Auth routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', password: 'password', role: 'user' });
    expect(res.statusCode).toBe(201);
  });
});
