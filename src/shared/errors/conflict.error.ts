import type { FastifyReply } from "fastify";

export function sendConflictError(reply: FastifyReply, message: string) {
  return reply.status(409).send({
    error: {
      code: 'CONFLICT',
      message,
    },
  });
}