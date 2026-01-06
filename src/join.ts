import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimLeading, trimTrailing } from './utils';

/**
 * 拼接多段路径，保留首尾分隔符特征
 *
 * @example
 * join('/foo/', '/bar/')  // → '/foo/bar/'
 * join('foo', 'bar')      // → 'foo/bar'
 * join('/foo', 'bar/')    // → '/foo/bar/'
 */
export function join(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  const first = parts[0];
  const last = parts[parts.length - 1];

  const hasLeading = first.startsWith(sep);
  const hasTrailing = last.endsWith(sep);

  const trimmed = parts.map((p) => trimTrailing(trimLeading(p, sep), sep)).filter(Boolean);

  let result = trimmed.join(sep);

  if (hasLeading) result = sep + result;
  if (hasTrailing) result = result + sep;

  return result;
}
