import { joinInternal } from './join';
import { getSeparator, parseArgs, trimLeading, trimTrailing } from './utils';

/**
 * 移除所有首尾分隔符
 *
 * @example
 * trim('/foo/')          // → 'foo'
 * trim('///foo///')      // → 'foo'
 * trim('foo')            // → 'foo'
 * trim('/foo/', '/bar/') // → 'foo/bar'
 */
export function trim(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const joined = joinInternal(inputs, sep);

  if (!joined) return '';

  return trimTrailing(trimLeading(joined, sep), sep);
}
