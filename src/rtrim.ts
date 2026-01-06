import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimTrailing } from './utils';

/**
 * 移除所有尾部分隔符
 *
 * @example
 * rtrim('foo/')      // → 'foo'
 * rtrim('foo///')    // → 'foo'
 * rtrim('foo')       // → 'foo'
 */
export function rtrim(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  const joined = parts.join(sep);
  return trimTrailing(joined, sep);
}
