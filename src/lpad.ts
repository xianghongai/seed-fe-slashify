import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimLeading } from './utils';

/**
 * 确保前导分隔符存在
 *
 * @example
 * lpad('foo')        // → '/foo'
 * lpad('/foo')       // → '/foo'
 * lpad('///foo')     // → '/foo'
 */
export function lpad(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  const joined = parts.join(sep);
  const trimmed = trimLeading(joined, sep);

  return trimmed ? sep + trimmed : '';
}
