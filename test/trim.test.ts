import { describe, expect, it } from 'vitest';
import { trim } from '../src/trim';

describe('trim', () => {
  describe('基础功能', () => {
    it('移除首尾斜杠', () => {
      expect(trim('/foo/')).toBe('foo');
    });

    it('只移除前导斜杠', () => {
      expect(trim('/foo')).toBe('foo');
    });

    it('只移除尾部斜杠', () => {
      expect(trim('foo/')).toBe('foo');
    });

    it('无首尾斜杠时原样返回', () => {
      expect(trim('foo')).toBe('foo');
    });

    it('移除多个连续首尾斜杠', () => {
      expect(trim('///foo///')).toBe('foo');
    });

    it('只有斜杠时返回空字符串', () => {
      expect(trim('/')).toBe('');
      expect(trim('///')).toBe('');
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(trim(['/foo', 'bar/'])).toBe('foo/bar');
    });

    it('嵌套数组', () => {
      expect(trim([['/foo'], ['bar', 'baz/']])).toBe('foo/bar/baz');
    });
  });

  describe('边界情况', () => {
    it('空字符串返回空', () => {
      expect(trim('')).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(trim(null)).toBe('');
      expect(trim(undefined)).toBe('');
      expect(trim(['/foo', null, 'bar/'])).toBe('foo/bar');
    });

    it('非字符串抛出 TypeError', () => {
      expect(() => trim(123 as unknown as string)).toThrow(TypeError);
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(trim('\\\\foo\\\\', { separator: '\\' })).toBe('foo');
    });

    it('使用多字符分隔符', () => {
      expect(trim('://foo://', { separator: '://' })).toBe('foo');
    });
  });
});
