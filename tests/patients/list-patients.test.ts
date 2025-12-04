import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';
import { prisma } from '@/services/prisma.service';

describe('GET /patients (paginated)', () => {
  let app: any;
  const prefix = `Paginated Patient ${Date.now()}`;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();

    await prisma.appointment.deleteMany();
    await prisma.doctorSchedule.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany();
    await prisma.doctorSchedule.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
    await app.close();
  });

  it('should list patients with pagination data', async () => {
    const payloads = Array.from({ length: 12 }, (_, index) => {
      const number = String(index + 1).padStart(2, '0');
      return {
        name: `${prefix}-${number}`,
        email: `${prefix.toLowerCase().replace(/\s+/g, '-')}-${number}@example.com`,
        phone: '11999999999',
      };
    });

    for (const payload of payloads) {
      await supertest(app.server).post('/api/patients').send(payload).expect(201);
    }

    const response = await supertest(app.server)
      .get('/api/patients')
      .query({ page: 2, limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body.meta).toEqual({
      page: 2,
      limit: 5,
      total: 12,
    });
    expect(response.body.data).toHaveLength(5);
    expect(response.body.data.map((patient: any) => patient.name)).toEqual([
      `${prefix}-06`,
      `${prefix}-07`,
      `${prefix}-08`,
      `${prefix}-09`,
      `${prefix}-10`,
    ]);
  });
});
