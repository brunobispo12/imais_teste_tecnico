import { FastifyReply, FastifyRequest } from 'fastify';
import { CreatePatientBody } from '@/modules/patients/schema/create-patient.schema';
import { GetPatientParams } from '@/modules/patients/schema/get-patient-params.schema';
import { GetPatientQuery } from '@/modules/patients/schema/get-patient-query.schema';
import { UpdatePatientBody } from '@/modules/patients/schema/update-patient.schema';
import { sendConflictError, sendNotFoundError } from '@/shared/errors';
import { patientService } from '@/modules/patients/patients.service';


export async function createPatientController(
  request: FastifyRequest<{ Body: CreatePatientBody }>,
  reply: FastifyReply,
) {
  const { name, email, phone } = request.body;

  const existing = await patientService.findByEmail(email);
  if (existing) {
    return sendConflictError(
      reply,
      'Já existe um paciente cadastrado com este e-mail.',
    );
  }

  const patient = await patientService.create({ name, email, phone });

  return reply.status(201).send(patient);
}


export async function getPatientWithAppointmentsController(
  request: FastifyRequest<{ Params: GetPatientParams; Querystring: GetPatientQuery }>,
  reply: FastifyReply,
) {
  const { patientId } = request.params;
  const { page, limit } = request.query;

  const patient = await patientService.findByIdWithAppointments(patientId, page, limit);

  if (!patient) {
    return sendNotFoundError(reply, 'Paciente não encontrado.');
  }

  return reply.send(patient);
}


export async function updatePatientController(
  request: FastifyRequest<{ Params: GetPatientParams; Body: UpdatePatientBody }>,
  reply: FastifyReply,
) {
  const { patientId } = request.params;
  const data = request.body;

  const updatedPatient = await patientService.update(patientId, data);

  if (!updatedPatient) {
    return sendNotFoundError(reply, 'Paciente não encontrado.');
  }

  return reply.send(updatedPatient);
}


export async function deletePatientController(
  request: FastifyRequest<{ Params: GetPatientParams }>,
  reply: FastifyReply,
) {
  const { patientId } = request.params;

  const deleted = await patientService.delete(patientId);

  if (!deleted) {
    return sendNotFoundError(reply, 'Paciente não encontrado.');
  }

  return reply.status(204).send();
}
