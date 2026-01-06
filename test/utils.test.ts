import { describe, expect, it } from 'vitest';
import { escapeRegex, getSeparator, normalizeInputs, trimLeading, trimTrailing } from '../src/utils';

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

    it('非字符串类型抛出 TypeError', () => {
      expect(() => normalizeInputs(123 as unknown as string)).toThrow(TypeError);
      expect(() => normalizeInputs([123] as unknown as string[])).toThrow(TypeError);
      expect(() => normalizeInputs({} as unknown as string)).toThrow(TypeError);
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
