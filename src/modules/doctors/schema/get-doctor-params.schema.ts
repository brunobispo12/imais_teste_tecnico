import { z } from 'zod';

export const getDoctorParamsSchema = z.object({
  doctorId: z.uuid('ID do médico inválido'),
});

export type GetDoctorParams = z.infer<typeof getDoctorParamsSchema>;
