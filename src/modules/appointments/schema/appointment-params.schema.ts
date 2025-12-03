import { z } from 'zod';

export const appointmentParamsSchema = z.object({
  appointmentId: z.string().uuid('ID do agendamento inválido'),
});

export type AppointmentParams = z.infer<typeof appointmentParamsSchema>;
