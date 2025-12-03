import { DoctorDTO } from '@/modules/doctors/types/doctor.dto';
import { DoctorScheduleDTO } from '@/modules/doctors/types/doctor-schedule.dto';

export interface DoctorWithSchedulesDTO extends DoctorDTO {
  schedules: DoctorScheduleDTO[];
}
