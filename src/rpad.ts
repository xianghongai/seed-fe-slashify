import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimTrailing } from './utils';

/**
 * 确保尾部分隔符存在
 *
 * @example
 * rpad('foo')        // → 'foo/'
 * rpad('foo/')       // → 'foo/'
 * rpad('foo///')     // → 'foo/'
 */
export function rpad(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  const joined = parts.join(sep);
  const trimmed = trimTrailing(joined, sep);

  return trimmed ? trimmed + sep : '';
}
