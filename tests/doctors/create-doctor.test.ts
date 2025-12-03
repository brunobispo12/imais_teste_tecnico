import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('POST /doctor', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a doctor successfully', async () => {
    const response = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. House',
        specialty: 'Diagnostician',
        consultationPrice: 500.00,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Dr. House');
    expect(response.body.specialty).toBe('Diagnostician');
  });

  it('should return 400 for invalid data', async () => {
    const response = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr',
        specialty: 'MD',
        consultationPrice: -100,
      });

    expect(response.status).toBe(400);
  });
});
