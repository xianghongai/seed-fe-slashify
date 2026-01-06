import { PRESERVED_PREFIXES } from './constants';
import { escapeRegex, getSeparator, normalizeInputs, parseArgs, trimLeading, trimTrailing } from './utils';

/**
 * 智能规范化路径（不仅仅是 trim）
 * - 移除尾部分隔符
 * - 保留有意义的前缀 (/, //, ./, ../, ~/, 协议://)
 * - 规范化多余的分隔符
 *
 * @example
 * normalize('foo/')              // → 'foo'
 * normalize('/foo/')             // → '/foo'
 * normalize('//cdn.com/')        // → '//cdn.com'
 * normalize('./foo/')            // → './foo'
 * normalize('../foo/')           // → '../foo'
 * normalize('~/foo/')            // → '~/foo'
 * normalize('///foo/')           // → '/foo'
 * normalize('https://a.com/')    // → 'https://a.com'
 * normalize('foo', 'bar')        // → 'foo/bar'
 */
export function normalize(...args: unknown[]): string {
  const { inputs, options } = parseArgs(args);
  const sep = getSeparator(options);
  const parts = normalizeInputs(inputs);

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
