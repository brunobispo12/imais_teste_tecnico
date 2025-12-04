import { doctorsRepository } from '@/modules/doctors/doctors.repository';
import { CreateDoctorBody } from '@/modules/doctors/schema/create-doctor.schema';
import { CreateScheduleBody } from '@/modules/doctors/schema/create-schedule.schema';
import { ListDoctorsQuery } from '@/modules/doctors/schema/list-doctors-query.schema';
import { UpdateDoctorBody } from '@/modules/doctors/schema/update-doctor.schema';
import { DoctorDTO } from '@/modules/doctors/types/doctor.dto';
import { DoctorScheduleDTO } from '@/modules/doctors/types/doctor-schedule.dto';

export class DoctorsService {
  async create(data: CreateDoctorBody): Promise<DoctorDTO> {
    return await doctorsRepository.create({
      name: data.name,
      specialty: data.specialty,
      consultationPrice: data.consultationPrice,
    });
  }

  async createSchedule(doctorId: string, data: CreateScheduleBody): Promise<DoctorScheduleDTO> {
    const doctor = await doctorsRepository.findById(doctorId);

    if (!doctor) {
      throw new Error('Doctor not found');
    }


    for (
      let day = data.availableFromWeekDay;
      day <= data.availableToWeekDay;
      day++
    ) {
      const hasConflict = await doctorsRepository.findConflicts(
        doctorId,
        day,
        data.availableFromTime,
        data.availableToTime,
      );

      if (hasConflict) {
        throw new Error('Schedule conflict');
      }
    }

    return await doctorsRepository.createSchedule({
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      availableFromWeekDay: data.availableFromWeekDay,
      availableToWeekDay: data.availableToWeekDay,
      availableFromTime: data.availableFromTime,
      availableToTime: data.availableToTime,
    });
  }

  async update(id: string, data: UpdateDoctorBody): Promise<DoctorDTO | null> {
    const doctor = await doctorsRepository.findById(id);

    if (!doctor) {
      return null;
    }

    return await doctorsRepository.update(id, data);
  }

  async delete(id: string) {
    const doctor = await doctorsRepository.findById(id);

    if (!doctor) {
      return null;
    }

    await doctorsRepository.delete(id);
    return true;
  }

  async list(params: ListDoctorsQuery) {
    const { page = 1, limit = 10 } = params;
    const { doctors, total } = await doctorsRepository.findAll(page, limit);

    return {
      data: doctors,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
}

export const doctorsService = new DoctorsService();
