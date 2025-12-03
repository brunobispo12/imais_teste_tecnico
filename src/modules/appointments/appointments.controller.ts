import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateAppointmentBody } from '@/modules/appointments/schema/create-appointment.schema';
import { AppointmentParams } from '@/modules/appointments/schema/appointment-params.schema';
import { appointmentsService } from '@/modules/appointments/appointments.service';
import { sendConflictError, sendNotFoundError } from '@/shared/errors';

export async function createAppointmentController(
  request: FastifyRequest<{ Body: CreateAppointmentBody }>,
  reply: FastifyReply,
) {
  const data = request.body;

  try {
    const appointment = await appointmentsService.create(data);
    return reply.status(201).send(appointment);
  } catch (error: any) {
    if (error.message === 'Doctor not found') {
      return sendNotFoundError(reply, 'Médico não encontrado.');
    }
    if (error.message === 'Doctor not available at this time') {
      return reply.status(400).send({ message: 'Médico não disponível neste horário.' });
    }
    if (error.message === 'Doctor already has an appointment at this time' || error.message === 'Patient already has an appointment at this time') {
      return sendConflictError(reply, 'Horário indisponível.');
    }
    throw error;
  }
}

export async function cancelAppointmentController(
  request: FastifyRequest<{ Params: AppointmentParams }>,
  reply: FastifyReply,
) {
  const { appointmentId } = request.params;

  try {
    await appointmentsService.cancel(appointmentId);
    return reply.status(204).send();
  } catch (error: any) {
    if (error.message === 'Appointment not found') {
      return sendNotFoundError(reply, 'Agendamento não encontrado.');
    }
    if (error.message === 'Appointment already cancelled') {
      return reply.status(400).send({ message: 'Agendamento já cancelado.' });
    }
    if (error.message === 'Cannot cancel appointment less than 2 hours before') {
      return reply.status(400).send({ message: 'Não é possível cancelar com menos de 2 horas de antecedência.' });
    }
    throw error;
  }
}
