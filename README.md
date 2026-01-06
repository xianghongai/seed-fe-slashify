# slashify

Tiny utilities for trimming, padding, and joining strings with separators.

## Installation

```bash
npm install slashify
# or
pnpm add slashify
# or
yarn add slashify
```

## Usage

```typescript
import { ltrim, rtrim, trim, lpad, rpad, pad, join, normalize } from 'slashify';

// 移除分隔符
ltrim('/foo')         // → 'foo'
ltrim('///foo')       // → 'foo'
rtrim('foo/')         // → 'foo'
rtrim('foo///')       // → 'foo'
trim('/foo/')         // → 'foo'
trim('///foo///')     // → 'foo'

// 确保分隔符
lpad('foo')           // → '/foo'
lpad('/foo')          // → '/foo'
rpad('foo')           // → 'foo/'
rpad('foo/')          // → 'foo/'
pad('foo')            // → '/foo/'
pad('/foo/')          // → '/foo/'

// 拼接
join(['/foo/', '/bar/'])  // → '/foo/bar/'
join(['foo', 'bar'])      // → 'foo/bar'
join(['/foo', 'bar/'])    // → '/foo/bar/'

// 智能规范化
normalize('foo/')              // → 'foo'
normalize('/foo/')             // → '/foo'       (保留绝对路径前缀)
normalize('//cdn.com/')        // → '//cdn.com'  (保留协议相对前缀)
normalize('./foo/')            // → './foo'      (保留相对路径前缀)
normalize('../foo/')           // → '../foo'     (保留上级路径前缀)
normalize('~/foo/')            // → '~/foo'      (保留主目录前缀)
normalize('https://a.com/')    // → 'https://a.com' (保留 URL 协议)
normalize('foo//bar///')       // → 'foo/bar'   (规范化中间多余斜杠)
```

## API

### 输入类型

所有函数都支持灵活的输入形式：

```typescript
// 单个字符串
ltrim('/foo')

// 数组
ltrim(['/foo', 'bar'])

// 嵌套数组
ltrim([['/foo'], ['bar', 'baz']])

// null/undefined 会被自动过滤
ltrim(['/foo', null, 'bar'])  // → 'foo/bar'
```

### 选项

所有函数都接受可选的 `options` 参数：

```typescript
interface SlashOptions {
  separator?: string;  // 默认 '/'
}

// 使用自定义分隔符
ltrim('\\foo', { separator: '\\' })  // → 'foo'
join(['foo', 'bar'], { separator: '::' })  // → 'foo::bar'
```

### 函数列表

| 函数 | 功能 | 示例 |
|------|------|------|
| `ltrim` | 移除所有前导分隔符 | `ltrim('///foo')` → `'foo'` |
| `rtrim` | 移除所有尾部分隔符 | `rtrim('foo///')` → `'foo'` |
| `trim` | 移除所有首尾分隔符 | `trim('///foo///')` → `'foo'` |
| `lpad` | 确保前导分隔符 | `lpad('foo')` → `'/foo'` |
| `rpad` | 确保尾部分隔符 | `rpad('foo')` → `'foo/'` |
| `pad` | 确保首尾分隔符 | `pad('foo')` → `'/foo/'` |
| `join` | 拼接并保留首尾特征 | `join(['/foo/', '/bar/'])` → `'/foo/bar/'` |
| `normalize` | 智能规范化路径 | `normalize('./foo/')` → `'./foo'` |

### normalize 保留的前缀

`normalize` 函数会保留以下有意义的前缀：

| 前缀 | 含义 | 示例 |
|------|------|------|
| `/` | 绝对路径 | `/foo/` → `/foo` |
| `//` | 协议相对 URL | `//cdn.com/` → `//cdn.com` |
| `./` | 当前目录 | `./foo/` → `./foo` |
| `../` | 上级目录 | `../foo/` → `../foo` |
| `~/` | 用户主目录 | `~/foo/` → `~/foo` |
| `x://` | URL 协议 | `https://a.com/` → `https://a.com` |

## License

MIT
