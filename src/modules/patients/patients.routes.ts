import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createPatientBodySchema } from '@/modules/patients/schema/create-patient.schema';
import { getPatientParamsSchema } from '@/modules/patients/schema/get-patient-params.schema';
import { getPatientQuerySchema } from '@/modules/patients/schema/get-patient-query.schema';
import { updatePatientBodySchema } from '@/modules/patients/schema/update-patient.schema';
import {
  createPatientController,
  deletePatientController,
  getPatientWithAppointmentsController,
  updatePatientController,
} from '@/modules/patients/patients.controller';

export default async function patientsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/patients', {
    schema: {
      tags: ['Patients'],
      body: createPatientBodySchema,
    },
  }, createPatientController);

  app.withTypeProvider<ZodTypeProvider>().get('/patient/:patientId', {
    schema: {
      tags: ['Patients'],
      params: getPatientParamsSchema,
      querystring: getPatientQuerySchema,
    },
  }, getPatientWithAppointmentsController);

  app.withTypeProvider<ZodTypeProvider>().patch('/patients/:patientId', {
    schema: {
      tags: ['Patients'],
      params: getPatientParamsSchema,
      body: updatePatientBodySchema,
    },
  }, updatePatientController);

  app.withTypeProvider<ZodTypeProvider>().delete('/patients/:patientId', {
    schema: {
      tags: ['Patients'],
      params: getPatientParamsSchema,
    },
  }, deletePatientController);
}
