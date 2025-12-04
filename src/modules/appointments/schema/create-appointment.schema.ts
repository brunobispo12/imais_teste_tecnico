import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const createAppointmentBodySchema = z.object({
  doctorId: z.string().uuid('ID do médico inválido'),
  patientId: z.string().uuid('ID do paciente inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  time: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm:ss)'),
});

export type CreateAppointmentBody = z.infer<typeof createAppointmentBodySchema>;
