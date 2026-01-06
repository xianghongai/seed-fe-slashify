# @seed-fe/slashify

用于 trimming/padding/joining 前导和尾随分隔符（默认：`/`）。

**不是**一个文件系统路径库；仅在**字符串**边界处操作分隔符。

## Installation

```bash
npm install @seed-fe/slashify
# or
pnpm add @seed-fe/slashify
# or
yarn add @seed-fe/slashify
```

## Usage

```typescript
import { ltrim, rtrim, trim, lpad, rpad, pad, join, normalize } from '@seed-fe/slashify';

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

// 拼接 (支持 variadic 和数组形式)
join('foo', 'bar')        // → 'foo/bar'
join('/foo/', '/bar/')    // → '/foo/bar/'
join(['foo', 'bar'])      // → 'foo/bar'
join(['/foo', 'bar/'])    // → '/foo/bar/'

// variadic 多参数拼接
trim('/foo', 'bar/')       // → 'foo/bar'
lpad('api', 'v1', 'users') // → '/api/v1/users'
rpad('foo', 'bar', 'baz')  // → 'foo/bar/baz/'

// 数字 ID 自动转换
join('users', 123, 'profile')  // → 'users/123/profile'
join('/api/v1', 'posts', 456)  // → '/api/v1/posts/456'

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

// variadic (多参数)
join('foo', 'bar', 'baz')
trim('/foo', 'bar/')

// 数组
ltrim(['/foo', 'bar'])

// 嵌套数组
ltrim([['/foo'], ['bar', 'baz']])

// null/undefined/空字符串会被自动过滤
ltrim(['/foo', null, '', 'bar'])  // → 'foo/bar'

// 数字类型自动转换为字符串
join(['foo', 123, 'bar'])  // → 'foo/123/bar'
join('users', 456)         // → 'users/456'

// 其他非字符串类型被静默过滤
join(['foo', {}, 'bar'])   // → 'foo/bar'
```

### 选项

所有函数都接受可选的 `options` 参数（作为最后一个参数）：

```typescript
interface SlashOptions {
  separator?: string;  // 默认 '/'
}

// 使用自定义分隔符
ltrim('\\foo', { separator: '\\' })  // → 'foo'
join('foo', 'bar', { separator: '::' })  // → 'foo::bar'
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
| `join` | 拼接并保留首尾特征 | `join('foo', 'bar')` → `'foo/bar'` |
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

### 重要行为说明

#### 纯分隔符输入

当输入仅包含分隔符时（如 `/`、`//`、`///`），各函数的行为：

| 函数 | 输入 `/` | 输入 `//` | 说明 |
|------|---------|----------|------|
| `trim` | `''` | `''` | 移除分隔符后为空 |
| `ltrim` | `''` | `''` | 移除分隔符后为空 |
| `rtrim` | `''` | `''` | 移除分隔符后为空 |
| `lpad` | `''` | `''` | 无实际内容可填充 |
| `rpad` | `''` | `''` | 无实际内容可填充 |
| `pad` | `''` | `''` | 无实际内容可填充 |
| `join` | `/` | `//` | 保留首尾特征 |
| `normalize` | `/` | `//` | **保留有意义前缀** |

**关键区别**: `normalize` 会识别并保留有意义的路径前缀，其他函数专注于分隔符操作。

#### 何时使用 normalize

如果你需要保留路径的语义前缀（如根目录 `/`、协议相对 `//`、相对路径 `./` `../`、主目录 `~/`），请使用 `normalize` 而非 `trim`。

```typescript
// 需要保留根目录语义
normalize('/')     // → '/'
trim('/')          // → ''

// 需要保留协议相对前缀
normalize('//')    // → '//'
trim('//')         // → ''
```

## Not-Related projects

- <https://www.npmjs.com/package/pathe>
- <https://www.npmjs.com/package/upath>
- <https://www.npmjs.com/package/path-browserify>
- <https://www.npmjs.com/package/slash>
- <https://www.npmjs.com/package/normalize-path>

## License

MIT
