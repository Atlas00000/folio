import { resolveClientLogConfig, type FolioClientLogConfig } from './config';
import { levelAllows, type LogLevel } from './levels';

export type LogFields = Record<string, unknown>;

/**
 * Browser/SSR-safe Folio logger. Gates by NEXT_PUBLIC_LOG_LEVEL.
 * Outputs structured objects so DevTools can expand fields.
 */
export class FolioLogger {
  private readonly config: FolioClientLogConfig;
  private readonly scope: string;

  constructor(scope = 'app', config: FolioClientLogConfig = resolveClientLogConfig()) {
    this.scope = scope;
    this.config = config;
  }

  child(scope: string): FolioLogger {
    return new FolioLogger(`${this.scope}:${scope}`, this.config);
  }

  debug(msg: string, fields?: LogFields): void {
    this.write('debug', msg, fields);
  }

  info(msg: string, fields?: LogFields): void {
    this.write('info', msg, fields);
  }

  warn(msg: string, fields?: LogFields): void {
    this.write('warn', msg, fields);
  }

  error(msg: string, fields?: LogFields): void {
    this.write('error', msg, fields);
  }

  private write(level: LogLevel, msg: string, fields?: LogFields): void {
    if (!levelAllows(this.config.level, level)) return;

    const label = `[${this.config.prefix}:${this.scope}] ${msg}`;
    const payload = fields && Object.keys(fields).length > 0 ? fields : undefined;

    switch (level) {
      case 'debug':
        if (payload) console.debug(label, payload);
        else console.debug(label);
        break;
      case 'info':
        if (payload) console.info(label, payload);
        else console.info(label);
        break;
      case 'warn':
        if (payload) console.warn(label, payload);
        else console.warn(label);
        break;
      case 'error':
        if (payload) console.error(label, payload);
        else console.error(label);
        break;
    }
  }
}

export const clientLogger = new FolioLogger('client');
export const apiLogger = new FolioLogger('api');
