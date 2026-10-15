/**
 * Folio server log levels — ordered from most to least verbose.
 * Controlled by LOG_LEVEL (default: debug in development, info otherwise).
 */
export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

const RANK: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

export function isLogLevel(value: string): value is LogLevel {
  return (LOG_LEVELS as readonly string[]).includes(value);
}

export function resolveLogLevel(
  envValue: string | undefined,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): LogLevel {
  const raw = envValue?.trim().toLowerCase();
  if (raw && isLogLevel(raw)) return raw;
  return nodeEnv === 'production' ? 'info' : 'debug';
}

export function levelAllows(current: LogLevel, message: LogLevel): boolean {
  return RANK[message] >= RANK[current];
}
