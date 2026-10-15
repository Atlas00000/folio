/**
 * Folio client log levels — ordered from most to least verbose.
 * Controlled by NEXT_PUBLIC_LOG_LEVEL (default: debug in development, warn otherwise).
 */
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

const RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function isLogLevel(value: string): value is LogLevel {
  return (LOG_LEVELS as readonly string[]).includes(value);
}

export function resolveLogLevel(
  envValue: string | undefined,
  nodeEnv: string | undefined,
): LogLevel {
  const raw = envValue?.trim().toLowerCase();
  if (raw && isLogLevel(raw)) return raw;
  return nodeEnv === 'production' ? 'warn' : 'debug';
}

export function levelAllows(current: LogLevel, message: LogLevel): boolean {
  return RANK[message] >= RANK[current];
}
