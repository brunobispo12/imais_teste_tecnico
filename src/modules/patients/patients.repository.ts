import { prisma } from '@/services/prisma.service';
import { Prisma } from '@prisma/client';

export class PatientsRepository {
  async create(data: Prisma.PatientCreateInput) {
    return await prisma.patient.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return await prisma.patient.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await prisma.patient.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIdWithAppointments(id: string, page: number = 1, limit: number = 10) {
    return await prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        appointments: {
          skip: (page - 1) * limit,
          take: limit,
          include: {
            doctor: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.PatientUpdateInput) {
    return await prisma.patient.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.patient.delete({
      where: {
        id,
      },
    });
  }
}

export const patientsRepository = new PatientsRepository();
