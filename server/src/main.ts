import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { API_CONTRACT_VERSION } from './common/api-version';
import { resolveCorsOrigin } from './common/cors';
import {
  FolioLogger,
  RequestLoggingInterceptor,
  createFastifyLoggerOptions,
  rootLogger,
} from './common/logging';
import { registerRateLimit } from './common/rate-limit';

async function bootstrap() {
  const nestLogger = new FolioLogger('Nest');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: createFastifyLoggerOptions() }),
    { logger: nestLogger },
  );

  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  await app.register(cookie, {
    secret: process.env.SESSION_SECRET ?? 'folio-dev-cookie-secret',
  });

  await app.register(multipart, {
    limits: { fileSize: 15 * 1024 * 1024 },
  });

  await registerRateLimit(app);

  app.enableCors({
    origin: resolveCorsOrigin(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Folio API')
    .setDescription(
      [
        'First-year accounting learning platform API.',
        '',
        `**Contract version:** ${API_CONTRACT_VERSION} (A3 freeze).`,
        'Breaking changes require a version bump and changelog note.',
        'Auth: HTTP-only cookie `folio_session`. Enrolment: university email.',
      ].join('\n'),
    )
    .setVersion(API_CONTRACT_VERSION)
    .addCookieAuth('folio_session')
    .addTag('health')
    .addTag('auth')
    .addTag('courses')
    .addTag('enrolments')
    .addTag('topics')
    .addTag('materials')
    .addTag('questions')
    .addTag('attempts')
    .addTag('progress')
    .addTag('tutor')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Freeze artefact for client generation (committed under server/openapi/)
  const openapiDir = path.join(process.cwd(), 'openapi');
  mkdirSync(openapiDir, { recursive: true });
  writeFileSync(
    path.join(openapiDir, 'openapi.json'),
    JSON.stringify(document, null, 2),
    'utf8',
  );
  rootLogger.info('openapi_written', {
    path: 'openapi/openapi.json',
    version: API_CONTRACT_VERSION,
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  rootLogger.info('api_listening', {
    port,
    docs: `http://localhost:${port}/docs`,
  });
}

bootstrap();
