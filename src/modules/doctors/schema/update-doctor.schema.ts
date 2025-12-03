import { z } from 'zod';

export const updateDoctorBodySchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  specialty: z.string().min(3, 'Especialidade deve ter pelo menos 3 caracteres').optional(),
  consultationPrice: z.number().positive('Preço da consulta deve ser positivo').optional(),
});

export type UpdateDoctorBody = z.infer<typeof updateDoctorBodySchema>;
