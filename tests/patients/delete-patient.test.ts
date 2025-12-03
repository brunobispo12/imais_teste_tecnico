import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('DELETE /patients/:patientId', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should delete a patient successfully', async () => {
    const email = `test-delete-${Date.now()}@example.com`;
    const createResponse = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Joao Pereira',
        email,
        phone: '11999999999',
      });

    const patientId = createResponse.body.id;

    const response = await supertest(app.server)
      .delete(`/api/patients/${patientId}`);

    expect(response.status).toBe(204);

    const getResponse = await supertest(app.server)
      .get(`/api/patient/${patientId}`);

    expect(getResponse.status).toBe(404);
  });

  it('should return 404 for non-existent patient', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await supertest(app.server)
      .delete(`/api/patients/${fakeId}`);

    expect(response.status).toBe(404);
  });
});
