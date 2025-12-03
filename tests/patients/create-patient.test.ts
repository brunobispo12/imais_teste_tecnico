import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('POST /patients', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a patient successfully', async () => {
    const email = `test-create-${Date.now()}@example.com`;
    const response = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Joao Silva',
        email,
        phone: '11999999999',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Joao Silva');
    expect(response.body.email).toBe(email);
  });

  it('should return 409 if email already exists', async () => {
    const email = `test-conflict-${Date.now()}@example.com`;

    await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Joao Silva',
        email,
        phone: '11999999999',
      });

    const response = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Joao Pereira',
        email,
        phone: '11888888888',
      });

    expect(response.status).toBe(409);
  });

  it('should return 400 for invalid data', async () => {
    const response = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Jo',
        email: 'invalid-email',
        phone: '123'
      });

    expect(response.status).toBe(400);
  });
});
