import Fastify, { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import routes from '@/routes';
import { ZodError } from 'zod';
import { sendValidationError } from '@/shared/errors';

export function buildApp(): FastifyInstance {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const apiBaseUrl =
    process.env.API_BASE_URL ??
    `http://localhost:${process.env.PORT}`;

  app.register(swagger, {
    openapi: {
      info: {
        title: 'API Medical Appointment',
        description: 'Documentação da API Medical Appointment',
        version: '1.0.0',
      },
      servers: [
        {
          url: apiBaseUrl,
          description: 'API server',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  app.get(
    '/openapi.json',
    {
      schema: {
        hide: true,
      },
    },
    async () => {
      return app.swagger();
    },
  );

  app.register(ScalarApiReference, {
    routePrefix: '/reference',
    configuration: {
      title: 'API Medical Appointment Reference',
      spec: {
        url: '/openapi.json',
      },
    },
  });

  app.register(routes, { prefix: '/api' });

  app.setErrorHandler((error: unknown, _request, reply) => {
    if (error instanceof ZodError || (error as any)?.issues) {
      return sendValidationError(reply, error);
    }

    const statusCode =
      typeof (error as any)?.statusCode === 'number'
        ? (error as any).statusCode
        : 500;

    const message =
      statusCode >= 500
        ? 'Erro interno no servidor'
        : typeof (error as any)?.message === 'string'
          ? (error as any).message
          : 'Erro inesperado';

    return reply.status(statusCode).send({
      error: {
        code: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'UNHANDLED_ERROR',
        message,
      },
    });
  });

  return app;
}
