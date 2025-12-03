import { z } from 'zod';

export const getPatientParamsSchema = z.object({
  patientId: z.uuid('patientId deve ser um UUID válido'),
});

export type GetPatientParams = z.infer<typeof getPatientParamsSchema>;
