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

    it('非字符串抛出 TypeError', () => {
      expect(() => lpad(123 as unknown as string)).toThrow(TypeError);
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
  });
});
