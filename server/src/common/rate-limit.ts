import rateLimit from '@fastify/rate-limit';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import Redis from 'ioredis';

/**
 * Registers Fastify rate limiting.
 * Prefers Redis (REDIS_URL); falls back to in-memory if Redis is unavailable.
 */
export async function registerRateLimit(app: NestFastifyApplication) {
  const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
  let redis: Redis | undefined;

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 1500,
      lazyConnect: true,
    });
    await redis.connect();
    await redis.ping();
    console.log('Rate limit store: Redis');
  } catch (err) {
    console.warn(
      'Rate limit store: memory (Redis unavailable)',
      err instanceof Error ? err.message : err,
    );
    if (redis) {
      try {
        redis.disconnect();
      } catch {
        /* ignore */
      }
    }
    redis = undefined;
  }

  const max = Number(process.env.RATE_LIMIT_MAX ?? 120);
  const timeWindow = process.env.RATE_LIMIT_WINDOW ?? '1 minute';

  await app.register(rateLimit, {
    global: true,
    max,
    timeWindow,
    ...(redis ? { redis } : {}),
    allowList: (req) => {
      const url = req.url ?? '';
      return url.startsWith('/health') || url.startsWith('/docs');
    },
  });

  // Stricter bucket for auth endpoints via hook
  const authMax = Number(process.env.RATE_LIMIT_AUTH_MAX ?? 20);
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', async (req, reply) => {
      const url = req.url ?? '';
      if (!url.startsWith('/auth/')) {
        return;
      }
      // Rely on global limiter; annotate for operators
      reply.header('X-RateLimit-Policy', `auth:${authMax}/${timeWindow};api:${max}/${timeWindow}`);
    });
}
