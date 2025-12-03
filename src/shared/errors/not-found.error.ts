import type { FastifyReply } from "fastify";

export function sendNotFoundError(reply: FastifyReply, message: string) {
  return reply.status(404).send({
    error: {
      code: 'NOT_FOUND',
      message,
    },
  });
}