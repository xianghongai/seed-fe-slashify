import type { SlashInputs, SlashOptions } from './types';
import { getSeparator, normalizeInputs, trimLeading, trimTrailing } from './utils';

/**
 * 确保首尾分隔符都存在
 *
 * @example
 * pad('foo')         // → '/foo/'
 * pad('/foo/')       // → '/foo/'
 * pad('///foo///')   // → '/foo/'
 */
export function pad(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  const joined = parts.join(sep);
  const trimmed = trimTrailing(trimLeading(joined, sep), sep);

  return trimmed ? sep + trimmed + sep : '';
}
