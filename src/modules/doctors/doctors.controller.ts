import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateDoctorBody } from '@/modules/doctors/schema/create-doctor.schema';
import { CreateScheduleBody } from '@/modules/doctors/schema/create-schedule.schema';
import { ListDoctorsQuery } from '@/modules/doctors/schema/list-doctors-query.schema';
import { GetDoctorParams } from '@/modules/doctors/schema/get-doctor-params.schema';
import { UpdateDoctorBody } from '@/modules/doctors/schema/update-doctor.schema';
import { doctorsService } from '@/modules/doctors/doctors.service';
import { sendConflictError, sendNotFoundError } from '@/shared/errors';

export async function createDoctorController(
  request: FastifyRequest<{ Body: CreateDoctorBody }>,
  reply: FastifyReply,
) {
  const data = request.body;
  const doctor = await doctorsService.create(data);
  return reply.status(201).send(doctor);
}

export async function listDoctorsController(
  request: FastifyRequest<{ Querystring: ListDoctorsQuery }>,
  reply: FastifyReply,
) {
  const result = await doctorsService.list(request.query);
  return reply.send(result);
}

export async function createDoctorScheduleController(
  request: FastifyRequest<{ Params: GetDoctorParams; Body: CreateScheduleBody }>,
  reply: FastifyReply,
) {
  const { doctorId } = request.params;
  const data = request.body;

  try {
    const schedule = await doctorsService.createSchedule(doctorId, data);
    return reply.status(201).send(schedule);
  } catch (error: any) {
    if (error.message === 'Doctor not found') {
      return sendNotFoundError(reply, 'Médico não encontrado.');
    }
    if (error.message === 'Schedule conflict') {
      return sendConflictError(reply, 'Conflito de agenda.');
    }
    throw error;
  }
}

export async function updateDoctorController(
  request: FastifyRequest<{ Params: GetDoctorParams; Body: UpdateDoctorBody }>,
  reply: FastifyReply,
) {
  const { doctorId } = request.params;
  const data = request.body;

  const updatedDoctor = await doctorsService.update(doctorId, data);

  if (!updatedDoctor) {
    return sendNotFoundError(reply, 'Médico não encontrado.');
  }

  return reply.send(updatedDoctor);
}

export async function deleteDoctorController(
  request: FastifyRequest<{ Params: GetDoctorParams }>,
  reply: FastifyReply,
) {
  const { doctorId } = request.params;

  const deleted = await doctorsService.delete(doctorId);

  if (!deleted) {
    return sendNotFoundError(reply, 'Médico não encontrado.');
  }

  return reply.status(204).send();
}
