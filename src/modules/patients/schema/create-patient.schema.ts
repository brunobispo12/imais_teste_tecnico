import { z } from 'zod';

export const createPatientBodySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(255, 'Nome muito longo'),
  email: z.email('E-mail inválido'),
  phone: z
    .string()
    .min(8, 'Telefone deve ter pelo menos 8 caracteres')
    .max(20, 'Telefone deve ter no máximo 20 caracteres'),
});

export type CreatePatientBody = z.infer<typeof createPatientBodySchema>;