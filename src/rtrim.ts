import { joinInternal } from './join';
import { getSeparator, parseArgs, trimTrailing } from './utils';

/**
 * 移除所有尾部分隔符
 *
 * @example
 * rtrim('foo/')          // → 'foo'
 * rtrim('foo///')        // → 'foo'
 * rtrim('foo')           // → 'foo'
 * rtrim('foo/', 'bar/')  // → 'foo/bar'
 */
export function rtrim(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const joined = joinInternal(inputs, sep);

  if (!joined) return '';

  return trimTrailing(joined, sep);
}
