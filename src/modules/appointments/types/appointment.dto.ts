import type { AppointmentStatusDTO } from "@/modules/appointments/types/appointment-status.dto";

export interface AppointmentDTO {
  id: string;
  date: string;
  time: string;
  formattedDate: string;
  formattedTime: string;
  status: AppointmentStatusDTO;
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
  price: string;
}
