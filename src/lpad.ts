import { joinInternal } from './join';
import { getSeparator, parseArgs, trimLeading } from './utils';

/**
 * 确保前导分隔符存在
 *
 * @example
 * lpad('foo')            // → '/foo'
 * lpad('/foo')           // → '/foo'
 * lpad('///foo')         // → '/foo'
 * lpad('foo', 'bar')     // → '/foo/bar'
 */
export function lpad(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const joined = joinInternal(inputs, sep);

  if (!joined) return '';

  const trimmed = trimLeading(joined, sep);
  return trimmed ? sep + trimmed : '';
}
