import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('PATCH /doctor/:doctorId', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update a doctor successfully', async () => {
    const createResponse = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. Banner',
        specialty: 'Physics',
        consultationPrice: 200.00,
      });

    const doctorId = createResponse.body.id;
    const newName = 'Dr. Hulk';

    const response = await supertest(app.server)
      .patch(`/api/doctor/${doctorId}`)
      .send({
        name: newName,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(newName);
    expect(response.body.specialty).toBe('Physics');
  });

  it('should return 404 for non-existent doctor', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await supertest(app.server)
      .patch(`/api/doctor/${fakeId}`)
      .send({
        name: 'Ghost',
      });

    expect(response.status).toBe(404);
  });
});
