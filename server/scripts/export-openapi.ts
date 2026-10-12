import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import { API_CONTRACT_VERSION } from '../src/common/api-version';

/**
 * Boots the Nest app just long enough to serialize OpenAPI, then exits.
 * Does not bind a port.
 */
async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Folio API')
    .setDescription(`Folio API contract freeze v${API_CONTRACT_VERSION}`)
    .setVersion(API_CONTRACT_VERSION)
    .addCookieAuth('folio_session')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const outDir = path.join(process.cwd(), 'openapi');
  mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'openapi.json');
  writeFileSync(outFile, JSON.stringify(document, null, 2), 'utf8');
  console.log(`Wrote ${outFile} (v${API_CONTRACT_VERSION})`);
  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
