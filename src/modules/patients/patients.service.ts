import { patientsRepository } from '@/modules/patients/patients.repository';
import { CreatePatientBody } from '@/modules/patients/schema/create-patient.schema';
import { ListPatientsQuery } from '@/modules/patients/schema/list-patients-query.schema';
import { UpdatePatientBody } from '@/modules/patients/schema/update-patient.schema';
import { PatientDTO } from '@/modules/patients/types/patient.dto';
import { PatientWithAppointmentsDTO } from '@/modules/patients/types/patient-with-appointments.dto';
import { formatDateLabel, formatPriceBRL, formatTimeLabel } from '@/shared/utils/formatters';

export class PatientsService {
  async create(data: CreatePatientBody): Promise<PatientDTO> {
    return await patientsRepository.create(data);
  }

  async findByEmail(email: string): Promise<PatientDTO | null> {
    return await patientsRepository.findByEmail(email);
  }

  async findByIdWithAppointments(id: string, page: number = 1, limit: number = 10): Promise<PatientWithAppointmentsDTO | null> {
    const patient = await patientsRepository.findByIdWithAppointments(id, page, limit);

    if (!patient) {
      return null;
    }

    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      appointments: patient.appointments.map((appointment) => ({
        id: appointment.id,
        date: formatDateLabel(appointment.date),
        time: formatTimeLabel(appointment.date),
        status: appointment.status,
        doctor: {
          id: appointment.doctor.id,
          name: appointment.doctor.name,
          specialty: appointment.doctor.specialty,
        },
        price: formatPriceBRL(appointment.doctor.consultationPrice),
      })),
    };
  }

  async list(params: ListPatientsQuery) {
    const { page = 1, limit = 10 } = params;
    const { patients, total } = await patientsRepository.findAll(page, limit);

    return {
      data: patients,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async update(id: string, data: UpdatePatientBody): Promise<PatientDTO | null> {
    const patient = await patientsRepository.findById(id);

    if (!patient) {
      return null;
    }

    return await patientsRepository.update(id, data);
  }

  async delete(id: string) {
    const patient = await patientsRepository.findById(id);

    if (!patient) {
      return null;
    }

    await patientsRepository.delete(id);
    return true;
  }
}

export const patientService = new PatientsService();
