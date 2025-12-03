import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('POST /doctors/:doctorId/agenda', () => {
  let app: any;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a schedule successfully', async () => {

    const doctorResponse = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. Strange',
        specialty: 'Surgeon',
        consultationPrice: 1000.00,
      });

    const doctorId = doctorResponse.body.id;

    const response = await supertest(app.server)
      .post(`/api/doctors/${doctorId}/agenda`)
      .send({
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: '08:00:00',
        availableToTime: '18:00:00',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.doctorId).toBe(doctorId);
  });

  it('should return 409 for conflicting schedule', async () => {

    const doctorResponse = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. Who',
        specialty: 'Time Lord',
        consultationPrice: 100.00,
      });

    const doctorId = doctorResponse.body.id;


    await supertest(app.server)
      .post(`/api/doctors/${doctorId}/agenda`)
      .send({
        availableFromWeekDay: 1,
        availableToWeekDay: 3,
        availableFromTime: '08:00:00',
        availableToTime: '12:00:00',
      });


    const response = await supertest(app.server)
      .post(`/api/doctors/${doctorId}/agenda`)
      .send({
        availableFromWeekDay: 2,
        availableToWeekDay: 4,
        availableFromTime: '10:00:00',
        availableToTime: '14:00:00',
      });

    expect(response.status).toBe(409);
  });

  it('should return 404 for non-existent doctor', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await supertest(app.server)
      .post(`/api/doctors/${fakeId}/agenda`)
      .send({
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: '08:00:00',
        availableToTime: '18:00:00',
      });

    expect(response.status).toBe(404);
  });
});
