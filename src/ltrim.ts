import { joinInternal } from './join';
import { getSeparator, parseArgs, trimLeading } from './utils';

/**
 * 移除所有前导分隔符
 *
 * @example
 * ltrim('/foo')          // → 'foo'
 * ltrim('///foo')        // → 'foo'
 * ltrim('foo')           // → 'foo'
 * ltrim('/foo', '/bar')  // → 'foo/bar'
 */
export function ltrim(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const joined = joinInternal(inputs, sep);

  if (!joined) return '';

  return trimLeading(joined, sep);
}
