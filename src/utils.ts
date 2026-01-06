import type { SlashInputs, SlashOptions } from './types';

const DEFAULT_SEPARATOR = '/';

/**
 * 获取分隔符
 */
export function getSeparator(options?: SlashOptions): string {
  return options?.separator ?? DEFAULT_SEPARATOR;
}

/**
 * 转义正则特殊字符
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 规范化输入：展平数组、过滤无效值、验证类型
 */
export function normalizeInputs(inputs: SlashInputs): string[] {
  const flat = [inputs].flat(2) as unknown[];

  return flat.filter((item): item is string => {
    if (item === null || item === undefined || item === '') {
      return false;
    }
    if (typeof item !== 'string') {
      throw new TypeError(`Expected string, got ${typeof item}`);
    }
    return true;
  });
}

/**
 * 移除字符串开头的所有连续分隔符
 */
export function trimLeading(str: string, separator: string): string {
  while (str.startsWith(separator)) {
    str = str.slice(separator.length);
  }
  return str;
}

/**
 * 移除字符串结尾的所有连续分隔符
 */
export function trimTrailing(str: string, separator: string): string {
  while (str.endsWith(separator)) {
    str = str.slice(0, -separator.length);
  }
  return str;
}
