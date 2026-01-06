import { joinInternal } from './join';
import { getSeparator, parseArgs, trimLeading, trimTrailing } from './utils';

/**
 * 确保首尾分隔符都存在
 *
 * @example
 * pad('foo')             // → '/foo/'
 * pad('/foo/')           // → '/foo/'
 * pad('///foo///')       // → '/foo/'
 * pad('foo', 'bar')      // → '/foo/bar/'
 */
export function pad(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const joined = joinInternal(inputs, sep);

  if (!joined) return '';

  const trimmed = trimTrailing(trimLeading(joined, sep), sep);
  return trimmed ? sep + trimmed + sep : '';
}
