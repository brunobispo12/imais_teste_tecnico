import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

const toSeconds = (time: string) => {
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

export const createScheduleBodySchema = z.object({
  availableFromWeekDay: z.number().min(0).max(6),
  availableToWeekDay: z.number().min(0).max(6),
  availableFromTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm:ss)'),
  availableToTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm:ss)'),
}).refine(
  (data) => data.availableFromWeekDay <= data.availableToWeekDay,
  { message: 'Dia inicial não pode ser maior que dia final' },
).refine(
  (data) => toSeconds(data.availableFromTime) < toSeconds(data.availableToTime),
  { message: 'Horário inicial deve ser menor que horário final' },
);

export type CreateScheduleBody = z.infer<typeof createScheduleBodySchema>;
