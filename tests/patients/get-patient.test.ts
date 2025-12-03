import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('GET /patient/:patientId', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get a patient by ID', async () => {
    const email = `test-get-${Date.now()}@example.com`;
    const createResponse = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Joao Pereira',
        email,
        phone: '11999999999',
      });

    const patientId = createResponse.body.id;

    const response = await supertest(app.server)
      .get(`/api/patient/${patientId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(patientId);
    expect(response.body.email).toBe(email);
    expect(response.body).toHaveProperty('appointments');
  });

  it('should return 404 for non-existent patient', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await supertest(app.server)
      .get(`/api/patient/${fakeId}`);

    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid UUID', async () => {
    const response = await supertest(app.server)
      .get(`/api/patient/invalid-uuid`);

    expect(response.status).toBe(400);
  });
});
