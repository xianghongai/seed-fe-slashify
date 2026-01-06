import { describe, expect, it } from 'vitest';
import { ltrim } from '../src/ltrim';

describe('ltrim', () => {
  describe('基础功能', () => {
    it('移除前导斜杠', () => {
      expect(ltrim('/foo')).toBe('foo');
    });

    it('无前导斜杠时原样返回', () => {
      expect(ltrim('foo')).toBe('foo');
    });

    it('移除多个连续前导斜杠', () => {
      expect(ltrim('///foo')).toBe('foo');
    });

    it('只有斜杠时返回空字符串', () => {
      expect(ltrim('/')).toBe('');
      expect(ltrim('///')).toBe('');
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(ltrim(['/foo', 'bar'])).toBe('foo/bar');
    });

    it('嵌套数组', () => {
      expect(ltrim([['/foo'], ['bar', 'baz']])).toBe('foo/bar/baz');
    });

    it('variadic 形式', () => {
      expect(ltrim('/foo', 'bar')).toBe('foo/bar');
      expect(ltrim('/foo/', '/bar/')).toBe('foo/bar/');
    });
  });

  describe('边界情况', () => {
    it('空字符串返回空', () => {
      expect(ltrim('')).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(ltrim(null)).toBe('');
      expect(ltrim(undefined)).toBe('');
      expect(ltrim(['/foo', null, 'bar'])).toBe('foo/bar');
    });

    it('非字符串静默过滤', () => {
      expect(ltrim({} as unknown as string)).toBe('');
      expect(ltrim(['/foo', {} as unknown as string, 'bar'])).toBe('foo/bar');
    });

    it('数字自动转换', () => {
      expect(ltrim(123 as unknown as string)).toBe('123');
      expect(ltrim(['/foo', 123 as unknown as string, 'bar'])).toBe('foo/123/bar');
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(ltrim('\\\\foo', { separator: '\\' })).toBe('foo');
    });

    it('使用多字符分隔符', () => {
      expect(ltrim('://://foo', { separator: '://' })).toBe('foo');
    });

    it('variadic + options', () => {
      expect(ltrim('\\\\foo', '\\\\bar', { separator: '\\' })).toBe('foo\\bar');
    });
  });
});
