import { appointmentsRepository } from '@/modules/appointments/appointments.repository';
import { doctorsRepository } from '@/modules/doctors/doctors.repository';
import { patientsRepository } from '@/modules/patients/patients.repository';
import { CreateAppointmentBody } from '@/modules/appointments/schema/create-appointment.schema';
import { AppointmentDTO } from '@/modules/appointments/types/appointment.dto';
import { mailtrapClient } from '@/services/mailtrap.service';
import { formatDateLabel, formatPriceBRL, formatTimeLabel } from '@/shared/utils/formatters';

const timeToSeconds = (time: string) => {
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

export class AppointmentsService {
  async create(data: CreateAppointmentBody): Promise<AppointmentDTO> {
    const appointmentDate = new Date(`${data.date}T${data.time}`);
    const weekDay = appointmentDate.getDay();


    const patient = await patientsRepository.findById(data.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const doctor = await doctorsRepository.findById(data.doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }




    const schedule = doctor.schedules.find(s => {
      if (weekDay < s.availableFromWeekDay || weekDay > s.availableToWeekDay) {
        return false;
      }
      const reqSeconds = timeToSeconds(data.time);
      return (
        reqSeconds >= timeToSeconds(s.availableFromTime) &&
        reqSeconds <= timeToSeconds(s.availableToTime)
      );
    });



    if (!schedule) {
      throw new Error('Doctor not available at this time');
    }

    const doctorConflict = await appointmentsRepository.findByDoctorAndDate(data.doctorId, appointmentDate);
    if (doctorConflict && doctorConflict.status !== 'CANCELADO') {
      throw new Error('Doctor already has an appointment at this time');
    }

    const patientConflict = await appointmentsRepository.findByPatientAndDate(data.patientId, appointmentDate);
    if (patientConflict && patientConflict.status !== 'CANCELADO') {
      throw new Error('Patient already has an appointment at this time');
    }

    const appointment = await appointmentsRepository.create({
      date: appointmentDate,
      doctor: { connect: { id: data.doctorId } },
      patient: { connect: { id: data.patientId } },
      status: 'AGENDADO',
    });

    await this.sendConfirmationEmail(appointment.patient.email, {
      patientName: appointment.patient.name,
      doctorName: appointment.doctor.name,
      date: data.date,
      time: data.time,
      specialty: appointment.doctor.specialty,
      price: Number(appointment.doctor.consultationPrice),
    });

    return {
      id: appointment.id,
      date: formatDateLabel(appointmentDate),
      time: formatTimeLabel(appointmentDate),
      status: appointment.status,
      doctor: {
        id: appointment.doctor.id,
        name: appointment.doctor.name,
        specialty: appointment.doctor.specialty,
      },
      price: formatPriceBRL(appointment.doctor.consultationPrice),
    };
  }

  async cancel(id: string) {
    const appointment = await appointmentsRepository.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'CANCELADO') {
      throw new Error('Appointment already cancelled');
    }

    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const diffInHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);



    if (diffInHours < 2) {
      throw new Error('Cannot cancel appointment less than 2 hours before');
    }

    await appointmentsRepository.updateStatus(id, 'CANCELADO');
    return true;
  }

  private async sendConfirmationEmail(to: string, data: any) {


    try {
      await mailtrapClient.send({
        from: {
          name: 'Clinica Medical Appointment',
          email: 'noreply@medical.com',
        },
        to: [{ email: to }],
        subject: 'Confirmacao de Agendamento',
        text: `Ola ${data.patientName}, seu agendamento na Clinica Medical Appointment com ${data.doctorName} (${data.specialty}) foi confirmado para ${data.date} as ${data.time}. Valor: ${formatPriceBRL(data.price)}.`,
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
    }
  }
}

export const appointmentsService = new AppointmentsService();
