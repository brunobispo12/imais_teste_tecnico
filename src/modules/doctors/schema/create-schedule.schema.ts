import { z } from 'zod';

export const createScheduleBodySchema = z.object({
  availableFromWeekDay: z.number().min(0).max(6),
  availableToWeekDay: z.number().min(0).max(6),
  availableFromTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de hora inválido (HH:mm:ss)'),
  availableToTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de hora inválido (HH:mm:ss)'),
});

export type CreateScheduleBody = z.infer<typeof createScheduleBodySchema>;
