import type { FastifyReply } from "fastify";

export function sendValidationError(reply: FastifyReply, error: unknown) {
  return reply.status(400).send({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Dados inválidos',
      issues:
        error && typeof error === 'object' && 'flatten' in error
          ? (error as any).flatten()
          : null,
    },
  });
}
