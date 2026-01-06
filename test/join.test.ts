import { describe, expect, it } from 'vitest';
import { join } from '../src/join';

describe('join', () => {
  describe('基础功能', () => {
    it('拼接两段', () => {
      expect(join('foo', 'bar')).toBe('foo/bar');
      expect(join(['foo', 'bar'])).toBe('foo/bar');
    });

    it('拼接多段', () => {
      expect(join('foo', 'bar', 'baz')).toBe('foo/bar/baz');
      expect(join(['foo', 'bar', 'baz'])).toBe('foo/bar/baz');
    });

    it('单段原样返回', () => {
      expect(join('foo')).toBe('foo');
      expect(join('/foo/')).toBe('/foo/');
    });
  });

  describe('首尾特征保留', () => {
    it('保留前导斜杠', () => {
      expect(join('/foo', 'bar')).toBe('/foo/bar');
    });

    it('保留尾部斜杠', () => {
      expect(join('foo', 'bar/')).toBe('foo/bar/');
    });

    it('两者都保留', () => {
      expect(join('/foo/', '/bar/')).toBe('/foo/bar/');
    });

    it('中间段的斜杠被移除', () => {
      expect(join('/foo/', '/bar/', '/baz/')).toBe('/foo/bar/baz/');
    });
  });

  describe('连续斜杠处理', () => {
    it('规范化多余斜杠', () => {
      expect(join('//foo//', '//bar//')).toBe('/foo/bar/');
    });

    it('处理只有斜杠的段', () => {
      expect(join('foo', '/', 'bar')).toBe('foo/bar');
    });
  });

  describe('多输入处理', () => {
    it('嵌套数组', () => {
      expect(join([['/foo'], ['bar', 'baz/']])).toBe('/foo/bar/baz/');
    });

    it('多段输入规范化中间斜杠', () => {
      expect(join('foo/', '/bar')).toBe('foo/bar');
    });
  });

  describe('边界情况', () => {
    it('空输入返回空', () => {
      expect(join('')).toBe('');
      expect(join([])).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(join(null)).toBe('');
      expect(join('/foo', null, 'bar/')).toBe('/foo/bar/');
    });

    it('全部是空或 null 时返回空', () => {
      expect(join(null, undefined, '')).toBe('');
    });

    it('非字符串静默过滤', () => {
      expect(join('foo', {} as unknown as string, 'bar')).toBe('foo/bar');
    });

    it('数字 ID 自动转换', () => {
      expect(join('users', 123 as unknown as string, 'profile')).toBe('users/123/profile');
      expect(join('/api/v1', 'posts', 456 as unknown as string)).toBe('/api/v1/posts/456');
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      expect(join('\\foo\\', '\\bar\\', { separator: '\\' })).toBe('\\foo\\bar\\');
    });

    it('使用多字符分隔符', () => {
      expect(join('://foo://', '://bar://', { separator: '://' })).toBe('://foo://bar://');
    });

    it('variadic + options', () => {
      expect(join('a', 'b', { separator: '::' })).toBe('a::b');
    });
  });
});
