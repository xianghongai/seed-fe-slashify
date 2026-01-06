import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimLeading, trimTrailing } from './utils';

/**
 * 移除所有首尾分隔符
 *
 * @example
 * trim('/foo/')       // → 'foo'
 * trim('///foo///')   // → 'foo'
 * trim('foo')         // → 'foo'
 */
export function trim(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  const joined = parts.join(sep);
  return trimTrailing(trimLeading(joined, sep), sep);
}
