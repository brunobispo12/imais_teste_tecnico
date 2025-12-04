import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('POST /appointments', () => {
  let app: any;
  let doctorId: string;
  let patientId: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();


    const doctorResponse = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. House',
        specialty: 'Diagnostician',
        consultationPrice: 500.00,
      });
    doctorId = doctorResponse.body.id;


    const scheduleResponse = await supertest(app.server)
      .post(`/api/doctors/${doctorId}/agenda`)
      .send({
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: '08:00:00',
        availableToTime: '18:00:00',
      });
    expect(scheduleResponse.status).toBe(201);


    const patientEmail = `patient.zero+${Date.now()}@example.com`;

    const patientResponse = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Patient Zero',
        email: patientEmail,
        phone: '123456789',
      });
    patientId = patientResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an appointment successfully', async () => {


    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
    if (nextMonday.getDay() === 0) nextMonday.setDate(nextMonday.getDate() + 1);


    const dateStr = '2025-12-08';

    const response = await supertest(app.server)
      .post('/api/appointments')
      .send({
        doctorId,
        patientId,
        date: dateStr,
        time: '10:00:00',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('AGENDADO');
  });

  it('should return 409 if doctor already has appointment', async () => {

    const patient2Email = `patient.two+${Date.now()}@example.com`;

    const patient2Response = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Patient Two',
        email: patient2Email,
        phone: '987654321',
      });
    const patient2Id = patient2Response.body.id;


    const dateStr = '2025-12-08';

    const response = await supertest(app.server)
      .post('/api/appointments')
      .send({
        doctorId,
        patientId: patient2Id,
        date: dateStr,
        time: '10:00:00',
      });

    expect(response.status).toBe(409);
  });

  it('should return 400 if doctor is not available', async () => {

    const dateStr = '2025-12-07';

    const response = await supertest(app.server)
      .post('/api/appointments')
      .send({
        doctorId,
        patientId,
        date: dateStr,
        time: '10:00:00',
      });

    expect(response.status).toBe(400);
  });
});
