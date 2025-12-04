import type { FastifyReply } from "fastify";

export function sendBadRequestError(reply: FastifyReply, message: string) {
  return reply.status(400).send({
    error: {
      code: 'BAD_REQUEST',
      message,
    },
  });
}
