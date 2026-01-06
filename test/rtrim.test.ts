import { describe, expect, it } from 'vitest';
import { rtrim } from '../src/rtrim';

describe('rtrim', () => {
  describe('基础功能', () => {
    it('移除尾部斜杠', () => {
      expect(rtrim('foo/')).toBe('foo');
    });

    it('无尾部斜杠时原样返回', () => {
      expect(rtrim('foo')).toBe('foo');
    });

    it('移除多个连续尾部斜杠', () => {
      expect(rtrim('foo///')).toBe('foo');
    });

    it('只有斜杠时返回空字符串', () => {
      expect(rtrim('/')).toBe('');
      expect(rtrim('///')).toBe('');
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(rtrim(['foo', 'bar/'])).toBe('foo/bar');
    });

    it('嵌套数组', () => {
      expect(rtrim([['foo'], ['bar', 'baz/']])).toBe('foo/bar/baz');
    });

    it('variadic 形式', () => {
      expect(rtrim('foo', 'bar/')).toBe('foo/bar');
      expect(rtrim('/foo/', '/bar/')).toBe('/foo/bar');
    });
  });

  describe('边界情况', () => {
    it('空字符串返回空', () => {
      expect(rtrim('')).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(rtrim(null)).toBe('');
      expect(rtrim(undefined)).toBe('');
      expect(rtrim(['foo', null, 'bar/'])).toBe('foo/bar');
    });

    it('非字符串静默过滤', () => {
      expect(rtrim({} as unknown as string)).toBe('');
      expect(rtrim(['foo', {} as unknown as string, 'bar/'])).toBe('foo/bar');
    });

    it('数字自动转换', () => {
      expect(rtrim(123 as unknown as string)).toBe('123');
      expect(rtrim(['foo', 123 as unknown as string, 'bar/'])).toBe('foo/123/bar');
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(rtrim('foo\\\\', { separator: '\\' })).toBe('foo');
    });

    it('使用多字符分隔符', () => {
      expect(rtrim('foo://://', { separator: '://' })).toBe('foo');
    });

    it('variadic + options', () => {
      expect(rtrim('foo\\\\', '\\\\bar\\\\', { separator: '\\' })).toBe('foo\\bar');
    });
  });
});
