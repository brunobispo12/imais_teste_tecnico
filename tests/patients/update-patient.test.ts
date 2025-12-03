import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('PATCH /patients/:patientId', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update a patient successfully', async () => {
    const email = `test-update-${Date.now()}@example.com`;
    const createResponse = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Joao Pereira',
        email,
        phone: '11999999999',
      });

    const patientId = createResponse.body.id;
    const newName = 'Joao Updated';

    const response = await supertest(app.server)
      .patch(`/api/patients/${patientId}`)
      .send({
        name: newName,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(newName);
    expect(response.body.email).toBe(email);
  });

  it('should return 404 for non-existent patient', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await supertest(app.server)
      .patch(`/api/patients/${fakeId}`)
      .send({
        name: 'Nao Existe',
      });

    expect(response.status).toBe(404);
  });
});
