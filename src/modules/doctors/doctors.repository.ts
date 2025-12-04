import { prisma } from '@/services/prisma.service';
import { Prisma } from '@prisma/client';
import { DoctorDTO } from '@/modules/doctors/types/doctor.dto';
import { DoctorWithSchedulesDTO } from '@/modules/doctors/types/doctor-with-schedules.dto';
import { DoctorScheduleDTO } from '@/modules/doctors/types/doctor-schedule.dto';

export class DoctorsRepository {
  async create(data: Prisma.DoctorCreateInput): Promise<DoctorDTO> {
    const doctor = await prisma.doctor.create({
      data,
    });
    return {
      ...doctor,
      consultationPrice: Number(doctor.consultationPrice).toString(),
    };
  }

  async findById(id: string): Promise<DoctorWithSchedulesDTO | null> {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        schedules: true,
      },
    });

    if (!doctor) return null;

    return {
      ...doctor,
      consultationPrice: Number(doctor.consultationPrice).toString(),
      schedules: doctor.schedules.map((schedule) => ({
        ...schedule,
      })),
    };
  }

  async update(id: string, data: Prisma.DoctorUpdateInput): Promise<DoctorDTO> {
    const doctor = await prisma.doctor.update({
      where: {
        id,
      },
      data,
    });
    return {
      ...doctor,
      consultationPrice: Number(doctor.consultationPrice).toString(),
    };
  }

  async delete(id: string) {
    return await prisma.doctor.delete({
      where: {
        id,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.doctor.count(),
    ]);

    return {
      doctors: doctors.map((doctor) => ({
        ...doctor,
        consultationPrice: Number(doctor.consultationPrice).toString(),
      })),
      total,
    };
  }

  async createSchedule(data: Prisma.DoctorScheduleCreateInput): Promise<DoctorScheduleDTO> {
    const schedule = await prisma.doctorSchedule.create({
      data,
    });
    return schedule;
  }

  async findConflicts(
    doctorId: string,
    weekDay: number,
    start: string,
    end: string,
  ) {
    const toSeconds = (time: string) => {
      const [h, m, s] = time.split(':').map(Number);
      return h * 3600 + m * 60 + s;
    };

    const requestedStart = toSeconds(start);
    const requestedEnd = toSeconds(end);

    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId },
    });

    return schedules.some((schedule) => {
      if (weekDay < schedule.availableFromWeekDay || weekDay > schedule.availableToWeekDay) {
        return false;
      }

      const existingStart = toSeconds(schedule.availableFromTime);
      const existingEnd = toSeconds(schedule.availableToTime);

      const overlaps = requestedStart < existingEnd && requestedEnd > existingStart;
      return overlaps;
    });
  }
}

export const doctorsRepository = new DoctorsRepository();
