import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '@/app';
import { prisma } from '@/services/prisma.service';

describe('GET /doctors (paginated)', () => {
  let app: any;
  const prefix = `Paginated Doctor ${Date.now()}`;

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

  it('should list doctors with pagination data', async () => {
    const payloads = Array.from({ length: 7 }, (_, index) => {
      const number = String(index + 1).padStart(2, '0');
      return {
        name: `${prefix}-${number}`,
        specialty: 'Generalist',
        consultationPrice: 100 + index,
      };
    });

    for (const payload of payloads) {
      await supertest(app.server).post('/api/doctor').send(payload).expect(201);
    }

    const response = await supertest(app.server)
      .get('/api/doctors')
      .query({ page: 2, limit: 3 });

    expect(response.status).toBe(200);
    expect(response.body.meta).toEqual({
      page: 2,
      limit: 3,
      total: 7,
    });
    expect(response.body.data).toHaveLength(3);
    expect(response.body.data.map((doctor: any) => doctor.name)).toEqual([
      `${prefix}-04`,
      `${prefix}-05`,
      `${prefix}-06`,
    ]);
    expect(response.body.data[0].consultationPrice).toMatch(/^R\\$/);
  });
});
