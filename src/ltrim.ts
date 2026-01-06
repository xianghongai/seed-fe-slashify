import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimLeading } from './utils';

/**
 * 移除所有前导分隔符
 *
 * @example
 * ltrim('/foo')      // → 'foo'
 * ltrim('///foo')    // → 'foo'
 * ltrim('foo')       // → 'foo'
 */
export function ltrim(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  const joined = parts.join(sep);
  return trimLeading(joined, sep);
}
