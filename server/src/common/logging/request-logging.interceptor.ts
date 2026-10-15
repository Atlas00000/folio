import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FolioLogger } from './folio-logger';

/**
 * Logs method, path, status, and duration for each Nest-handled request.
 * Complements Fastify's built-in access log with Folio-structured fields.
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly log = new FolioLogger('http');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const req = context.switchToHttp().getRequest<{
      method?: string;
      url?: string;
      routerPath?: string;
      id?: string;
    }>();
    const res = context.switchToHttp().getResponse<{ statusCode?: number }>();
    const started = Date.now();
    const method = req.method ?? 'UNKNOWN';
    const path = req.routerPath ?? req.url ?? '';

    return next.handle().pipe(
      tap({
        next: () => {
          this.log.info('request', {
            method,
            path,
            statusCode: res.statusCode ?? 200,
            durationMs: Date.now() - started,
            reqId: req.id,
          });
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          this.log.emit('error', 'request_failed', {
            method,
            path,
            statusCode: res.statusCode ?? 500,
            durationMs: Date.now() - started,
            reqId: req.id,
            err: message,
          });
        },
      }),
    );
  }
}
