import { z } from 'zod';

export const updatePatientBodySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(255, 'Nome muito longo')
    .optional(),
  email: z.email('E-mail inválido').optional(),
  phone: z
    .string()
    .min(8, 'Telefone deve ter pelo menos 8 caracteres')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional(),
});

export type UpdatePatientBody = z.infer<typeof updatePatientBodySchema>;
