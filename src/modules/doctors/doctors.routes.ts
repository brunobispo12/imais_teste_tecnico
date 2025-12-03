import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createDoctorBodySchema } from '@/modules/doctors/schema/create-doctor.schema';
import { createScheduleBodySchema } from '@/modules/doctors/schema/create-schedule.schema';
import { getDoctorParamsSchema } from '@/modules/doctors/schema/get-doctor-params.schema';
import { updateDoctorBodySchema } from '@/modules/doctors/schema/update-doctor.schema';
import {
  createDoctorController,
  createDoctorScheduleController,
  deleteDoctorController,
  updateDoctorController,
} from '@/modules/doctors/doctors.controller';

export default async function doctorsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/doctor', {
    schema: {
      tags: ['Doctors'],
      body: createDoctorBodySchema,
    },
  }, createDoctorController);

  app.withTypeProvider<ZodTypeProvider>().post('/doctors/:doctorId/agenda', {
    schema: {
      tags: ['Doctors'],
      params: getDoctorParamsSchema,
      body: createScheduleBodySchema,
    },
  }, createDoctorScheduleController);

  app.withTypeProvider<ZodTypeProvider>().patch('/doctor/:doctorId', {
    schema: {
      tags: ['Doctors'],
      params: getDoctorParamsSchema,
      body: updateDoctorBodySchema,
    },
  }, updateDoctorController);

  app.withTypeProvider<ZodTypeProvider>().delete('/doctor/:doctorId', {
    schema: {
      tags: ['Doctors'],
      params: getDoctorParamsSchema,
    },
  }, deleteDoctorController);
}
