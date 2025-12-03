import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('DELETE /doctor/:doctorId', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should delete a doctor successfully', async () => {
    const createResponse = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. Jekyll',
        specialty: 'Chemist',
        consultationPrice: 300.00,
      });

    const doctorId = createResponse.body.id;

    const response = await supertest(app.server)
      .delete(`/api/doctor/${doctorId}`);

    expect(response.status).toBe(204);


    const updateResponse = await supertest(app.server)
      .patch(`/api/doctor/${doctorId}`)
      .send({ name: 'Mr. Hyde' });

    expect(updateResponse.status).toBe(404);
  });

  it('should return 404 for non-existent doctor', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await supertest(app.server)
      .delete(`/api/doctor/${fakeId}`);

    expect(response.status).toBe(404);
  });
});
