import { describe, expect, it } from 'vitest';
import { lpad } from '../src/lpad';

describe('lpad', () => {
  describe('基础功能', () => {
    it('添加前导斜杠', () => {
      expect(lpad('foo')).toBe('/foo');
    });

    it('已有前导斜杠时保持单个', () => {
      expect(lpad('/foo')).toBe('/foo');
    });

    it('多个前导斜杠时规范化为单个', () => {
      expect(lpad('///foo')).toBe('/foo');
    });

    it('只有斜杠时返回空字符串', () => {
      expect(lpad('/')).toBe('');
      expect(lpad('///')).toBe('');
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(lpad(['foo', 'bar'])).toBe('/foo/bar');
    });

    it('嵌套数组', () => {
      expect(lpad([['foo'], ['bar', 'baz']])).toBe('/foo/bar/baz');
    });

    it('variadic 形式', () => {
      expect(lpad('foo', 'bar')).toBe('/foo/bar');
      expect(lpad('/foo/', '/bar/')).toBe('/foo/bar/');
    });
  });

  describe('边界情况', () => {
    it('空字符串返回空', () => {
      expect(lpad('')).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(lpad(null)).toBe('');
      expect(lpad(undefined)).toBe('');
      expect(lpad(['foo', null, 'bar'])).toBe('/foo/bar');
    });

    it('非字符串静默过滤', () => {
      expect(lpad({} as unknown as string)).toBe('');
      expect(lpad(['foo', {} as unknown as string, 'bar'])).toBe('/foo/bar');
    });

    it('数字自动转换', () => {
      expect(lpad(123 as unknown as string)).toBe('/123');
      expect(lpad(['foo', 123 as unknown as string, 'bar'])).toBe('/foo/123/bar');
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(lpad('foo', { separator: '\\' })).toBe('\\foo');
      expect(lpad('\\\\foo', { separator: '\\' })).toBe('\\foo');
    });

    it('使用多字符分隔符', () => {
      expect(lpad('foo', { separator: '://' })).toBe('://foo');
      expect(lpad('://://foo', { separator: '://' })).toBe('://foo');
    });

    it('variadic + options', () => {
      expect(lpad('foo', 'bar', { separator: '\\' })).toBe('\\foo\\bar');
    });
  });
});
