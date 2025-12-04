import { prisma } from '@/services/prisma.service';
import { Prisma } from '@prisma/client';

export class AppointmentsRepository {
  async create(data: Prisma.AppointmentCreateInput) {
    return await prisma.appointment.create({
      data,
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  async findByDoctorAndDate(doctorId: string, date: Date) {
    return await prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        status: {
          not: 'CANCELADO',
        },
      },
    });
  }

  async findByPatientAndDate(patientId: string, date: Date) {
    return await prisma.appointment.findFirst({
      where: {
        patientId,
        date,
        status: {
          not: 'CANCELADO',
        },
      },
    });
  }

  async updateStatus(id: string, status: 'CANCELADO' | 'FINALIZADO') {
    return await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}

export const appointmentsRepository = new AppointmentsRepository();
