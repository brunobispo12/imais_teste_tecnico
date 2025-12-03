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

  return app;
}
