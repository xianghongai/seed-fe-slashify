import { describe, expect, it } from 'vitest';
import { rpad } from '../src/rpad';

describe('rpad', () => {
  describe('基础功能', () => {
    it('添加尾部斜杠', () => {
      expect(rpad('foo')).toBe('foo/');
    });

    it('已有尾部斜杠时保持单个', () => {
      expect(rpad('foo/')).toBe('foo/');
    });

    it('多个尾部斜杠时规范化为单个', () => {
      expect(rpad('foo///')).toBe('foo/');
    });

    it('只有斜杠时返回空字符串', () => {
      expect(rpad('/')).toBe('');
      expect(rpad('///')).toBe('');
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(rpad(['foo', 'bar'])).toBe('foo/bar/');
    });

    it('嵌套数组', () => {
      expect(rpad([['foo'], ['bar', 'baz']])).toBe('foo/bar/baz/');
    });

    it('variadic 形式', () => {
      expect(rpad('foo', 'bar')).toBe('foo/bar/');
      expect(rpad('/foo/', '/bar/')).toBe('/foo/bar/');
    });
  });

  describe('边界情况', () => {
    it('空字符串返回空', () => {
      expect(rpad('')).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(rpad(null)).toBe('');
      expect(rpad(undefined)).toBe('');
      expect(rpad(['foo', null, 'bar'])).toBe('foo/bar/');
    });

    it('非字符串静默过滤', () => {
      expect(rpad({} as unknown as string)).toBe('');
      expect(rpad(['foo', {} as unknown as string, 'bar'])).toBe('foo/bar/');
    });

    it('数字自动转换', () => {
      expect(rpad(123 as unknown as string)).toBe('123/');
      expect(rpad(['foo', 123 as unknown as string, 'bar'])).toBe('foo/123/bar/');
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(rpad('foo', { separator: '\\' })).toBe('foo\\');
      expect(rpad('foo\\\\', { separator: '\\' })).toBe('foo\\');
    });

    it('使用多字符分隔符', () => {
      expect(rpad('foo', { separator: '://' })).toBe('foo://');
      expect(rpad('foo://://', { separator: '://' })).toBe('foo://');
    });

    it('variadic + options', () => {
      expect(rpad('foo', 'bar', { separator: '\\' })).toBe('foo\\bar\\');
    });
  });
});
