import { appointmentsRepository } from '@/modules/appointments/appointments.repository';
import { doctorsRepository } from '@/modules/doctors/doctors.repository';
import { CreateAppointmentBody } from '@/modules/appointments/schema/create-appointment.schema';
import { AppointmentDTO } from '@/modules/appointments/types/appointment.dto';
import { mailtrapClient } from '@/services/mailtrap.service';

export class AppointmentsService {
  async create(data: CreateAppointmentBody): Promise<AppointmentDTO> {
    const appointmentDate = new Date(`${data.date}T${data.time}`);
    const weekDay = appointmentDate.getDay();


    const doctor = await doctorsRepository.findById(data.doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }




    const schedule = doctor.schedules.find(s =>
      weekDay >= s.availableFromWeekDay &&
      weekDay <= s.availableToWeekDay &&
      data.time >= s.availableFromTime &&
      data.time <= s.availableToTime
    );



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
      date: data.date,
      time: data.time,
      status: 'SCHEDULED',
      doctor: {
        id: appointment.doctor.id,
        name: appointment.doctor.name,
        specialty: appointment.doctor.specialty,
      },
      price: Number(appointment.doctor.consultationPrice).toFixed(2),
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
        text: `Ola ${data.patientName}, seu agendamento na Clinica Medical Appointment com ${data.doctorName} (${data.specialty}) foi confirmado para ${data.date} as ${data.time}. Valor: R$ ${data.price.toFixed(2)}.`,
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
    }
  }
}

export const appointmentsService = new AppointmentsService();
