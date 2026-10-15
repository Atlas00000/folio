import { resolveLogLevel, type LogLevel } from './levels';

export type FolioLogConfig = {
  level: LogLevel;
  /** Pretty multi-line output for local terminals; JSON for containers/prod. */
  pretty: boolean;
  service: string;
};

/**
 * Resolve logging behaviour from process env.
 * LOG_LEVEL — trace|debug|info|warn|error|fatal
 * LOG_PRETTY — true|false (default: true when not production)
 * LOG_SERVICE — service name tag (default: folio-api)
 */
export function resolveLogConfig(
  env: NodeJS.ProcessEnv = process.env,
): FolioLogConfig {
  const nodeEnv = env.NODE_ENV;
  const level = resolveLogLevel(env.LOG_LEVEL, nodeEnv);
  const prettyFlag = env.LOG_PRETTY?.trim().toLowerCase();
  const pretty =
    prettyFlag === 'true'
      ? true
      : prettyFlag === 'false'
        ? false
        : nodeEnv !== 'production';

  return {
    level,
    pretty,
    service: env.LOG_SERVICE?.trim() || 'folio-api',
  };
}
