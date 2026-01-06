import { describe, expect, it } from 'vitest';
import { escapeRegex, getSeparator, normalizeInputs, parseArgs, trimLeading, trimTrailing } from '../src/utils';

describe('utils', () => {
  describe('getSeparator', () => {
    it('默认返回 /', () => {
      expect(getSeparator()).toBe('/');
      expect(getSeparator({})).toBe('/');
    });

    it('使用自定义分隔符', () => {
      expect(getSeparator({ separator: '\\' })).toBe('\\');
      expect(getSeparator({ separator: '://' })).toBe('://');
    });

    it('空字符串分隔符抛出错误', () => {
      expect(() => getSeparator({ separator: '' })).toThrow('separator cannot be an empty string');
    });
  });

  describe('escapeRegex', () => {
    it('转义正则特殊字符', () => {
      expect(escapeRegex('.')).toBe('\\.');
      expect(escapeRegex('*')).toBe('\\*');
      expect(escapeRegex('?')).toBe('\\?');
      expect(escapeRegex('\\')).toBe('\\\\');
      expect(escapeRegex('[a]')).toBe('\\[a\\]');
    });

    it('斜杠不需要转义', () => {
      expect(escapeRegex('/')).toBe('/');
    });

    it('普通字符不转义', () => {
      expect(escapeRegex('abc')).toBe('abc');
      expect(escapeRegex('123')).toBe('123');
    });
  });

  describe('parseArgs', () => {
    it('空参数返回空输入', () => {
      expect(parseArgs([])).toEqual({ inputs: [] });
    });

    it('单个字符串参数', () => {
      expect(parseArgs(['foo'])).toEqual({ inputs: ['foo'] });
    });

    it('多个字符串参数', () => {
      expect(parseArgs(['foo', 'bar'])).toEqual({ inputs: ['foo', 'bar'] });
    });

    it('最后一个参数是 options 对象', () => {
      expect(parseArgs(['foo', { separator: '\\' }])).toEqual({
        inputs: ['foo'],
        options: { separator: '\\' },
      });
    });

    it('多参数加 options', () => {
      expect(parseArgs(['foo', 'bar', { separator: '\\' }])).toEqual({
        inputs: ['foo', 'bar'],
        options: { separator: '\\' },
      });
    });

    it('空对象也视为 options', () => {
      expect(parseArgs(['foo', {}])).toEqual({
        inputs: ['foo'],
        options: {},
      });
    });

    it('数组不视为 options', () => {
      expect(parseArgs([['foo', 'bar']])).toEqual({ inputs: [['foo', 'bar']] });
    });
  });

  describe('normalizeInputs', () => {
    it('处理单个字符串', () => {
      expect(normalizeInputs('foo')).toEqual(['foo']);
    });

    it('处理数组', () => {
      expect(normalizeInputs(['foo', 'bar'])).toEqual(['foo', 'bar']);
    });

    it('处理嵌套数组', () => {
      expect(normalizeInputs([['foo'], 'bar', ['baz']])).toEqual(['foo', 'bar', 'baz']);
    });

    it('过滤 null 和 undefined', () => {
      expect(normalizeInputs(null)).toEqual([]);
      expect(normalizeInputs(undefined)).toEqual([]);
      expect(normalizeInputs(['foo', null, 'bar', undefined])).toEqual(['foo', 'bar']);
    });

    it('过滤空字符串', () => {
      expect(normalizeInputs('')).toEqual([]);
      expect(normalizeInputs(['foo', '', 'bar'])).toEqual(['foo', 'bar']);
    });

    it('静默过滤非字符串类型', () => {
      expect(normalizeInputs({} as unknown as string)).toEqual([]);
      expect(normalizeInputs(['foo', {}, 'bar'] as unknown as string[])).toEqual(['foo', 'bar']);
    });

    it('数字类型自动转换为字符串', () => {
      expect(normalizeInputs(123 as unknown as string)).toEqual(['123']);
      expect(normalizeInputs(['foo', 123, 'bar'] as unknown as string[])).toEqual(['foo', '123', 'bar']);
      expect(normalizeInputs([1, 2, 3] as unknown as string[])).toEqual(['1', '2', '3']);
    });

    it('特殊数字值被过滤', () => {
      expect(normalizeInputs(NaN as unknown as string)).toEqual([]);
      expect(normalizeInputs(Infinity as unknown as string)).toEqual([]);
      expect(normalizeInputs(-Infinity as unknown as string)).toEqual([]);
      expect(normalizeInputs(['foo', NaN, Infinity, 'bar'] as unknown as string[])).toEqual(['foo', 'bar']);
    });
  });

  describe('trimLeading', () => {
    it('移除单个前导分隔符', () => {
      expect(trimLeading('/foo', '/')).toBe('foo');
    });

    it('移除多个连续前导分隔符', () => {
      expect(trimLeading('///foo', '/')).toBe('foo');
    });

    it('无前导分隔符时原样返回', () => {
      expect(trimLeading('foo', '/')).toBe('foo');
    });

    it('支持多字符分隔符', () => {
      expect(trimLeading('://://foo', '://')).toBe('foo');
    });
  });

  describe('trimTrailing', () => {
    it('移除单个尾部分隔符', () => {
      expect(trimTrailing('foo/', '/')).toBe('foo');
    });

    it('移除多个连续尾部分隔符', () => {
      expect(trimTrailing('foo///', '/')).toBe('foo');
    });

    it('无尾部分隔符时原样返回', () => {
      expect(trimTrailing('foo', '/')).toBe('foo');
    });

    it('支持多字符分隔符', () => {
      expect(trimTrailing('foo://:// ', '://')).toBe('foo://:// ');
      expect(trimTrailing('foo://://', '://')).toBe('foo');
    });
  });
});
