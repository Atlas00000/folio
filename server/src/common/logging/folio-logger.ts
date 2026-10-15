import { LoggerService } from '@nestjs/common';
import { resolveLogConfig, type FolioLogConfig } from './config';
import { levelAllows, type LogLevel } from './levels';

export type LogFields = Record<string, unknown>;

type LogRecord = {
  ts: string;
  level: LogLevel;
  service: string;
  context?: string;
  msg: string;
  fields?: LogFields;
};

/**
 * Structured Folio logger — Nest LoggerService compatible.
 * Emits one JSON line (or pretty text) per event for Docker/Railway scraping.
 */
export class FolioLogger implements LoggerService {
  private readonly config: FolioLogConfig;
  private context?: string;

  constructor(context?: string, config: FolioLogConfig = resolveLogConfig()) {
    this.config = config;
    this.context = context;
  }

  setContext(context: string): void {
    this.context = context;
  }

  child(context: string): FolioLogger {
    return new FolioLogger(context, this.config);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.write('info', message, optionalParams);
  }

  info(message: string, fields?: LogFields): void {
    this.emit('info', message, fields);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    const trace = optionalParams.find((p) => typeof p === 'string');
    const fields: LogFields = {};
    if (typeof trace === 'string' && trace.includes('\n')) {
      fields.stack = trace;
    }
    this.write('error', message, optionalParams, fields);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.write('trace', message, optionalParams);
  }

  fatal(message: string, fields?: LogFields): void {
    this.emit('fatal', message, fields);
  }

  /** Explicit structured event (preferred over Nest LoggerService overloads). */
  emit(level: LogLevel, msg: string, fields?: LogFields): void {
    if (!levelAllows(this.config.level, level)) return;

    const record: LogRecord = {
      ts: new Date().toISOString(),
      level,
      service: this.config.service,
      msg,
    };
    if (this.context) record.context = this.context;
    if (fields && Object.keys(fields).length > 0) record.fields = fields;

    const line = this.config.pretty ? formatPretty(record) : JSON.stringify(record);
    writeStdout(level, line);
  }

  private write(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
    extra: LogFields = {},
  ): void {
    const fieldsCandidate = optionalParams.find(isPlainFields);
    const ctxCandidate = optionalParams.find(
      (p) => typeof p === 'string' && !String(p).includes('\n'),
    );
    const context =
      typeof ctxCandidate === 'string' ? ctxCandidate : this.context;

    const fields: LogFields = {
      ...extra,
      ...(fieldsCandidate ?? {}),
    };
    if (message instanceof Error) {
      fields.err = message.message;
      if (message.stack) fields.stack = message.stack;
      this.withTempContext(context, () =>
        this.emit(level, message.message, fields),
      );
      return;
    }

    const msg = typeof message === 'string' ? message : safeStringify(message);
    this.withTempContext(context, () => this.emit(level, msg, fields));
  }

  private withTempContext(context: string | undefined, fn: () => void): void {
    const prev = this.context;
    if (context) this.context = context;
    try {
      fn();
    } finally {
      this.context = prev;
    }
  }
}

function formatPretty(record: LogRecord): string {
  const ctx = record.context ? ` [${record.context}]` : '';
  const fieldStr =
    record.fields && Object.keys(record.fields).length > 0
      ? ` ${safeStringify(record.fields)}`
      : '';
  return `${record.ts} ${record.level.toUpperCase().padEnd(5)}${ctx} ${record.msg}${fieldStr}`;
}

function writeStdout(level: LogLevel, line: string): void {
  if (level === 'error' || level === 'fatal') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

function isPlainFields(value: unknown): value is LogFields {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Error)
  );
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Process-wide default logger (bootstrap / scripts). */
export const rootLogger = new FolioLogger('bootstrap');
