import type { SlashInputs, SlashOptions } from './types';
import { escapeRegex, getSeparator, normalizeInputs, trimLeading, trimTrailing } from './utils';

/**
 * 检测有意义的前缀的正则模式（仅用于默认分隔符 '/'）
 * 顺序很重要：更具体的模式要放在前面
 */
const PRESERVED_PREFIXES = [
  /^\.\.\//, // ../
  /^\.\//, // ./
  /^~\//, // ~/
  /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/\/?/, // 协议:// 或 协议:/// (http://, https://, file:///, etc.)
  /^\/\/(?!\/)/, // // 后面紧跟非斜杠字符 (协议相对 URL)
  /^\//, // / (绝对路径)
];

/**
 * 智能规范化路径
 * - 移除尾部分隔符
 * - 保留有意义的前缀 (/, //, ./, ../, ~/, 协议://)
 * - 规范化多余的分隔符
 *
 * @example
 * normalize('foo/')          // → 'foo'
 * normalize('/foo/')         // → '/foo'
 * normalize('//cdn.com/')    // → '//cdn.com'
 * normalize('./foo/')        // → './foo'
 * normalize('../foo/')       // → '../foo'
 * normalize('~/foo/')        // → '~/foo'
 * normalize('///foo/')       // → '/foo'
 * normalize('https://a.com/')// → 'https://a.com'
 */
export function normalize(input: SlashInputs, options?: SlashOptions): string {
  const sep = getSeparator(options);
  const parts = normalizeInputs(input);

  if (parts.length === 0) return '';

  let str = parts.join(sep);

  // 只有默认分隔符 '/' 才进行前缀保留处理
  if (sep === '/') {
    // 1. 先提取有意义的前缀
    let prefix = '';
    for (const pattern of PRESERVED_PREFIXES) {
      const match = str.match(pattern);
      if (match) {
        prefix = match[0];
        str = str.slice(prefix.length);
        break;
      }
    }

    // 2. 规范化剩余部分的多余斜杠
    str = str.replace(/\/+/g, '/');

    // 3. 移除首尾分隔符
    str = trimTrailing(trimLeading(str, sep), sep);

    return prefix + str;
  }

  // 自定义分隔符：简单处理，规范化多余分隔符并移除首尾
  // 使用 (?:...)+ 确保匹配一个或多个完整的分隔符
  const sepRegex = new RegExp(`(?:${escapeRegex(sep)})+`, 'g');
  str = str.replace(sepRegex, sep);
  str = trimTrailing(trimLeading(str, sep), sep);

  return str;
}
