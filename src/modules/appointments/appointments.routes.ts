import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAppointmentBodySchema } from '@/modules/appointments/schema/create-appointment.schema';
import { appointmentParamsSchema } from '@/modules/appointments/schema/appointment-params.schema';
import { createAppointmentController, cancelAppointmentController } from '@/modules/appointments/appointments.controller';

export default async function appointmentsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/appointments', {
    schema: {
      tags: ['Appointments'],
      body: createAppointmentBodySchema,
    },
  }, createAppointmentController);

  app.withTypeProvider<ZodTypeProvider>().patch('/appointments/:appointmentId/cancel', {
    schema: {
      tags: ['Appointments'],
      params: appointmentParamsSchema,
    },
  }, cancelAppointmentController);
}
