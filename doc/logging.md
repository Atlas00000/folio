# Folio logging

Structured logging for local debugging across the Nest API, Next client, and Docker data plane.

## Server (`server/src/common/logging/`)

| Piece | Role |
| --- | --- |
| `FolioLogger` | Nest `LoggerService` — JSON or pretty lines with `ts`, `level`, `service`, `context`, `msg`, `fields` |
| `createFastifyLoggerOptions` | Aligns Fastify/pino access logs + redacts cookies |
| `RequestLoggingInterceptor` | Per-request method/path/status/`durationMs`/`reqId` |

Env (see `.env.example`):

- `LOG_LEVEL` — `trace` \| `debug` \| `info` \| `warn` \| `error` \| `fatal`
- `LOG_PRETTY` — `true` for local terminals; `false` for JSON (containers)
- `LOG_SERVICE` — service tag (default `folio-api`)

```ts
import { FolioLogger } from './common/logging';

const log = new FolioLogger('my-module');
log.info('enrolment_created', { courseId, userId });
```

## Client (`client/src/lib/logging/`)

`FolioLogger` / `apiLogger` gate console output by `NEXT_PUBLIC_LOG_LEVEL` (`debug` \| `info` \| `warn` \| `error`). The shared `api()` client logs request start, success, HTTP errors, and network failures with duration.

```ts
import { FolioLogger } from '@/lib/logging';

const log = new FolioLogger('courses-hub');
log.debug('hub_loaded', { courseCount: 3 });
```

## Docker (`docker-compose.yml`)

- All services use `json-file` logging with `max-size: 10m` / `max-file: 5` and a container name tag.
- Postgres logs connections, checkpoints, and statements ≥ 500ms.
- Redis runs at `notice` log level.

```bash
docker-compose logs -f postgres
docker-compose logs --tail=100 redis
```

## Tips

- Prefer `log.info('event_name', { fields })` over string interpolation so logs stay greppable.
- Never log session cookies or password hashes; Fastify already redacts `cookie` / `authorization`.
- Password-reset tokens still appear only when `NODE_ENV !== 'production'` (dev convenience).
