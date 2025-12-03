import { FastifyInstance } from 'fastify';
import patientsRoutes from '@/modules/patients/patients.routes';
import doctorsRoutes from '@/modules/doctors/doctors.routes';
import appointmentsRoutes from '@/modules/appointments/appointments.routes';

export default async function routes(app: FastifyInstance) {
  app.register(patientsRoutes);
  app.register(doctorsRoutes);
  app.register(appointmentsRoutes);
}