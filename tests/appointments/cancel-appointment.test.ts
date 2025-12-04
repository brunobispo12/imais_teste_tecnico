import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';

describe('PATCH /appointments/:appointmentId/cancel', () => {
  let app: any;
  let doctorId: string;
  let patientId: string;
  let appointmentId: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();


    const doctorResponse = await supertest(app.server)
      .post('/api/doctor')
      .send({
        name: 'Dr. Strange',
        specialty: 'Surgeon',
        consultationPrice: 1000.00,
      });
    doctorId = doctorResponse.body.id;


    await supertest(app.server)
      .post(`/api/doctors/${doctorId}/agenda`)
      .send({
        availableFromWeekDay: 0,
        availableToWeekDay: 6,
        availableFromTime: '00:00:00',
        availableToTime: '23:59:59',
      });


    const patientEmail = `tony+${Date.now()}@stark.com`;

    const patientResponse = await supertest(app.server)
      .post('/api/patients')
      .send({
        name: 'Tony Stark',
        email: patientEmail,
        phone: '123456789',
      });
    patientId = patientResponse.body.id;


    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().split('T')[0];

    const appointmentResponse = await supertest(app.server)
      .post('/api/appointments')
      .send({
        doctorId,
        patientId,
        date: dateStr,
        time: '14:00:00',
      });
    appointmentId = appointmentResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should cancel an appointment successfully', async () => {
    const response = await supertest(app.server)
      .patch(`/api/appointments/${appointmentId}/cancel`);

    expect(response.status).toBe(204);



    const response2 = await supertest(app.server)
      .patch(`/api/appointments/${appointmentId}/cancel`);

    expect(response2.status).toBe(400);
  });

  it('should not allow cancelling less than 2 hours before', async () => {



    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);


    const dateStr = oneHourFromNow.toLocaleDateString('en-CA');
    const timeStr = oneHourFromNow.toTimeString().split(' ')[0];


    const appointmentResponse = await supertest(app.server)
      .post('/api/appointments')
      .send({
        doctorId,
        patientId,
        date: dateStr,
        time: timeStr,
      });


    if (appointmentResponse.status === 201) {
      const id = appointmentResponse.body.id;

      const response = await supertest(app.server)
        .patch(`/api/appointments/${id}/cancel`);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('menos de 2 horas');
    }
  });
});
