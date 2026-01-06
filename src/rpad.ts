import { joinInternal } from './join';
import { getSeparator, parseArgs, trimTrailing } from './utils';

/**
 * 确保尾部分隔符存在
 *
 * @example
 * rpad('foo')            // → 'foo/'
 * rpad('foo/')           // → 'foo/'
 * rpad('foo///')         // → 'foo/'
 * rpad('foo', 'bar')     // → 'foo/bar/'
 */
export function rpad(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const joined = joinInternal(inputs, sep);

  if (!joined) return '';

  const trimmed = trimTrailing(joined, sep);
  return trimmed ? trimmed + sep : '';
}
