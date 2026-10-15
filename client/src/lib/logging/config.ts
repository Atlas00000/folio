import { resolveLogLevel, type LogLevel } from './levels';

export type FolioClientLogConfig = {
  level: LogLevel;
  /** Prefix shown in console for grepping. */
  prefix: string;
};

/**
 * Resolve client logging from NEXT_PUBLIC_* env (inlined at build time).
 * NEXT_PUBLIC_LOG_LEVEL — debug|info|warn|error
 */
export function resolveClientLogConfig(): FolioClientLogConfig {
  return {
    level: resolveLogLevel(
      process.env.NEXT_PUBLIC_LOG_LEVEL,
      process.env.NODE_ENV,
    ),
    prefix: 'folio',
  };
}
