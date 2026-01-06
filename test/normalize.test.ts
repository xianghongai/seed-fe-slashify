import { describe, expect, it } from 'vitest';
import { normalize } from '../src/normalize';

describe('normalize', () => {
  describe('基础功能', () => {
    it('移除尾部斜杠', () => {
      expect(normalize('foo/')).toBe('foo');
    });

    it('移除多个尾部斜杠', () => {
      expect(normalize('foo///')).toBe('foo');
    });

    it('无斜杠时原样返回', () => {
      expect(normalize('foo')).toBe('foo');
    });

    it('规范化中间多余斜杠', () => {
      expect(normalize('foo//bar')).toBe('foo/bar');
      expect(normalize('foo///bar///baz')).toBe('foo/bar/baz');
    });
  });

  describe('前缀保留', () => {
    describe('绝对路径 /', () => {
      it('保留单个前导斜杠', () => {
        expect(normalize('/foo/')).toBe('/foo');
      });

      it('多个前导斜杠规范化为单个', () => {
        expect(normalize('///foo/')).toBe('/foo');
      });
    });

    describe('协议相对 //', () => {
      it('保留协议相对前缀', () => {
        expect(normalize('//cdn.com/')).toBe('//cdn.com');
      });

      it('保留协议相对前缀和路径', () => {
        expect(normalize('//cdn.com/path/')).toBe('//cdn.com/path');
      });
    });

    describe('相对路径 ./', () => {
      it('保留当前目录前缀', () => {
        expect(normalize('./foo/')).toBe('./foo');
      });

      it('规范化相对路径中的多余斜杠', () => {
        expect(normalize('./foo//bar/')).toBe('./foo/bar');
      });
    });

    describe('上级目录 ../', () => {
      it('保留上级目录前缀', () => {
        expect(normalize('../foo/')).toBe('../foo');
      });

      it('规范化上级路径中的多余斜杠', () => {
        expect(normalize('../foo//bar/')).toBe('../foo/bar');
      });
    });

    describe('用户主目录 ~/', () => {
      it('保留主目录前缀', () => {
        expect(normalize('~/foo/')).toBe('~/foo');
      });

      it('规范化主目录路径中的多余斜杠', () => {
        expect(normalize('~/foo//bar/')).toBe('~/foo/bar');
      });
    });

    describe('URL 协议', () => {
      it('保留 https://', () => {
        expect(normalize('https://example.com/')).toBe('https://example.com');
      });

      it('保留 http://', () => {
        expect(normalize('http://example.com/')).toBe('http://example.com');
      });

      it('保留 ftp://', () => {
        expect(normalize('ftp://example.com/')).toBe('ftp://example.com');
      });

      it('保留 file://', () => {
        expect(normalize('file:///path/to/file/')).toBe('file:///path/to/file');
      });

      it('保留 ssh://', () => {
        expect(normalize('ssh://git@github.com/')).toBe('ssh://git@github.com');
      });

      it('保留带路径的 URL', () => {
        expect(normalize('https://example.com/path/to/resource/')).toBe('https://example.com/path/to/resource');
      });

      it('规范化 URL 中的多余斜杠', () => {
        expect(normalize('https://example.com//path//to/')).toBe('https://example.com/path/to');
      });
    });
  });

  describe('多输入处理', () => {
    it('数组形式拼接后处理', () => {
      expect(normalize(['/foo/', '/bar/'])).toBe('/foo/bar');
    });

    it('嵌套数组', () => {
      expect(normalize([['/foo'], ['bar', 'baz/']])).toBe('/foo/bar/baz');
    });
  });

  describe('边界情况', () => {
    it('空输入返回空', () => {
      expect(normalize('')).toBe('');
      expect(normalize([])).toBe('');
    });

    it('null/undefined 被过滤', () => {
      expect(normalize(null)).toBe('');
      expect(normalize(['/foo', null, 'bar/'])).toBe('/foo/bar');
    });

    it('只有斜杠时返回前缀', () => {
      expect(normalize('/')).toBe('/');
      expect(normalize('//')).toBe('//');
      expect(normalize('///')).toBe('/');
    });

    it('非字符串抛出 TypeError', () => {
      expect(() => normalize(123 as unknown as string)).toThrow(TypeError);
    });
  });

  describe('自定义分隔符', () => {
    it('使用反斜杠', () => {
      // 自定义分隔符不保留前缀，只规范化多余分隔符并移除尾部
      expect(normalize('\\\\foo\\\\bar\\\\', { separator: '\\' })).toBe('foo\\bar');
    });

    it('使用多字符分隔符', () => {
      // 自定义分隔符不保留前缀
      expect(normalize('://foo://://bar://', { separator: '://' })).toBe('foo://bar');
    });
  });
});
