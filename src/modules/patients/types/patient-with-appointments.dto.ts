import type { PatientDTO } from "@/modules/patients/types/patient.dto";
import type { AppointmentDTO } from "@/modules/appointments/types/appointment.dto";

export interface PatientWithAppointmentsDTO extends PatientDTO {
  appointments: AppointmentDTO[];
}