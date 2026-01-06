import { DEFAULT_SEPARATOR } from './constants';
import type { SlashInputs, SlashOptions } from './types';

/**
 * 获取分隔符，校验不能为空字符串
 */
export function getSeparator(options?: SlashOptions): string {
  const sep = options?.separator ?? DEFAULT_SEPARATOR;
  if (sep === '') {
    throw new Error('separator cannot be an empty string');
  }
  return sep;
}

/**
 * 转义正则特殊字符
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 检测是否为 SlashOptions 对象
 */
function isSlashOptions(value: unknown): value is SlashOptions {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('separator' in value || Object.keys(value).length === 0)
  );
}

/**
 * 解析 variadic 参数，分离输入和选项
 */
export function parseArgs(args: unknown[]): { inputs: SlashInputs; options?: SlashOptions } {
  if (args.length === 0) {
    return { inputs: [] };
  }

  const last = args[args.length - 1];

  // 检测最后一个参数是否为 options 对象
  if (isSlashOptions(last)) {
    return {
      inputs: args.slice(0, -1) as SlashInputs,
      options: last,
    };
  }

  return { inputs: args as SlashInputs };
}

/**
 * 规范化输入：展平数组、过滤无效值
 * - 数字类型自动转换为字符串
 * - 过滤 null/undefined/空字符串
 * - 静默过滤其他非字符串类型
 */
export function normalizeInputs(inputs: SlashInputs): string[] {
  const flat = [inputs].flat(Infinity) as unknown[];

  return flat
    .map((item) => {
      // 数字类型自动转换为字符串（排除 NaN 和 Infinity）
      if (typeof item === 'number' && Number.isFinite(item)) {
        return String(item);
      }
      return item;
    })
    .filter((item): item is string => {
      // 过滤 null/undefined/空字符串
      if (item === null || item === undefined || item === '') {
        return false;
      }
      // 静默过滤非字符串类型（数字已在上面转换）
      if (typeof item !== 'string') {
        return false;
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
