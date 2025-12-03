import { z } from 'zod';

export const createDoctorBodySchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  specialty: z.string().min(3, 'Especialidade deve ter pelo menos 3 caracteres'),
  consultationPrice: z.number().positive('Preço da consulta deve ser positivo'),
});

export type CreateDoctorBody = z.infer<typeof createDoctorBodySchema>;
