import type { SlashInputs } from './types';
import { getSeparator, normalizeInputs, parseArgs, trimLeading, trimTrailing } from './utils';

/**
 * 内部 join 逻辑，供其他函数复用
 */
export function joinInternal(inputs: SlashInputs, separator: string): string {
  const parts = normalizeInputs(inputs);

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  const first = parts[0];
  const last = parts[parts.length - 1];

  const hasLeading = first.startsWith(separator);
  const hasTrailing = last.endsWith(separator);

  const trimmed = parts.map((p) => trimTrailing(trimLeading(p, separator), separator)).filter(Boolean);

  let result = trimmed.join(separator);

  if (hasLeading) result = separator + result;
  if (hasTrailing) result = result + separator;

  return result;
}

/**
 * 拼接多段路径，保留首尾分隔符特征
 *
 * @example
 * join('/foo/', '/bar/')       // → '/foo/bar/'
 * join('foo', 'bar')           // → 'foo/bar'
 * join('/foo', 'bar/')         // → '/foo/bar/'
 * join(['foo', 'bar'])         // → 'foo/bar'
 * join('a', 'b', { separator: '\\' }) // → 'a\\b'
 */
export function join(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  return joinInternal(inputs, sep);
}
