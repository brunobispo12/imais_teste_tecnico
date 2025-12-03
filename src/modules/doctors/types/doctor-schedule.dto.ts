export interface DoctorScheduleDTO {
  id: string;
  doctorId: string;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
}
