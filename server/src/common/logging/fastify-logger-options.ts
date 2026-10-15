import type { FastifyServerOptions } from 'fastify';
import { resolveLogConfig } from './config';
import type { LogLevel } from './levels';

/**
 * Fastify/pino options aligned with Folio LOG_* env.
 * JSON lines only (no pino-pretty dep) so Docker/Railway scrape cleanly.
 * FolioLogger handles human-readable pretty output for Nest-side events.
 */
export function createFastifyLoggerOptions(
  env: NodeJS.ProcessEnv = process.env,
): NonNullable<FastifyServerOptions['logger']> {
  const config = resolveLogConfig(env);

  return {
    level: toPinoLevel(config.level),
    base: { service: config.service },
    timestamp: () => `,"ts":"${new Date().toISOString()}"`,
    redact: {
      paths: [
        'req.headers.cookie',
        'req.headers.authorization',
        'res.headers["set-cookie"]',
      ],
      censor: '[redacted]',
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          remoteAddress: req.socket?.remoteAddress,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  };
}

function toPinoLevel(level: LogLevel): string {
  return level;
}
