import { describe, expect, it } from 'vitest';
import { pad } from '../src/pad';

describe('pad', () => {
  describe('基础功能', () => {
    it('添加首尾斜杠', () => {
      expect(pad('foo')).toBe('/foo/');
    });

    it('已有首尾斜杠时保持单个', () => {
      expect(pad('/foo/')).toBe('/foo/');
    });

    it('只有前导斜杠时添加尾部', () => {
      expect(pad('/foo')).toBe('/foo/');
    });

    it('只有尾部斜杠时添加前导', () => {
      expect(pad('foo/')).toBe('/foo/');
    });

    it('多个首尾斜杠时规范化为单个', () => {
      expect(pad('///foo///')).toBe('/foo/');
    });

    it('只有斜杠时返回空字符串', () => {
      expect(pad('/')).toBe('');
      expect(pad('///')).toBe('');
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(pad(['foo', 'bar'])).toBe('/foo/bar/');
    });

    it('嵌套数组', () => {
      expect(pad([['foo'], ['bar', 'baz']])).toBe('/foo/bar/baz/');
    });

    it('variadic 形式', () => {
      expect(pad('foo', 'bar')).toBe('/foo/bar/');
      expect(pad('/foo/', '/bar/')).toBe('/foo/bar/');
    });
  });

  describe('边界情况', () => {
    it('空字符串返回空', () => {
      expect(pad('')).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(pad(null)).toBe('');
      expect(pad(undefined)).toBe('');
      expect(pad(['foo', null, 'bar'])).toBe('/foo/bar/');
    });

    it('非字符串静默过滤', () => {
      expect(pad({} as unknown as string)).toBe('');
      expect(pad(['foo', {} as unknown as string, 'bar'])).toBe('/foo/bar/');
    });

    it('数字自动转换', () => {
      expect(pad(123 as unknown as string)).toBe('/123/');
      expect(pad(['foo', 123 as unknown as string, 'bar'])).toBe('/foo/123/bar/');
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(pad('foo', { separator: '\\' })).toBe('\\foo\\');
      expect(pad('\\\\foo\\\\', { separator: '\\' })).toBe('\\foo\\');
    });

    it('使用多字符分隔符', () => {
      expect(pad('foo', { separator: '://' })).toBe('://foo://');
      expect(pad('://foo://', { separator: '://' })).toBe('://foo://');
    });

    it('variadic + options', () => {
      expect(pad('foo', 'bar', { separator: '\\' })).toBe('\\foo\\bar\\');
    });
  });
});
