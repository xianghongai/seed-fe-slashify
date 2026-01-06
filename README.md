# @seed-fe/slashify

Tiny utilities for trimming, padding, and joining strings with separators (default: `/`).

This package is intentionally **not** a filesystem path library; it only manipulates separator characters at string boundaries (plus join boundaries when combining multiple inputs).

## Installation

```bash
pnpm add @seed-fe/slashify
# or
npm install @seed-fe/slashify
# or
yarn add @seed-fe/slashify
```

## Usage

```typescript
import { ltrim, rtrim, trim, lpad, rpad, pad, join, normalize } from '@seed-fe/slashify';

// Remove separators
ltrim('/foo')         // → 'foo'
ltrim('///foo')       // → 'foo'
rtrim('foo/')         // → 'foo'
rtrim('foo///')       // → 'foo'
trim('/foo/')         // → 'foo'
trim('///foo///')     // → 'foo'

// Ensure separators
lpad('foo')           // → '/foo'
lpad('/foo')          // → '/foo'
rpad('foo')           // → 'foo/'
rpad('foo/')          // → 'foo/'
pad('foo')            // → '/foo/'
pad('/foo/')          // → '/foo/'

// Join (supports variadic and array forms)
join('foo', 'bar')        // → 'foo/bar'
join('/foo/', '/bar/')    // → '/foo/bar/'
join(['foo', 'bar'])      // → 'foo/bar'
join(['/foo', 'bar/'])    // → '/foo/bar/'

// Variadic multi-argument joining
trim('/foo', 'bar/')       // → 'foo/bar'
lpad('api', 'v1', 'users') // → '/api/v1/users'
rpad('foo', 'bar', 'baz')  // → 'foo/bar/baz/'

// Numeric ID auto-conversion
join('users', 123, 'profile')  // → 'users/123/profile'
join('/api/v1', 'posts', 456)  // → '/api/v1/posts/456'

// Smart normalization
normalize('foo/')              // → 'foo'
normalize('/foo/')             // → '/foo'       (preserves absolute path prefix)
normalize('//cdn.com/')        // → '//cdn.com'  (preserves protocol-relative prefix)
normalize('./foo/')            // → './foo'      (preserves relative path prefix)
normalize('../foo/')           // → '../foo'     (preserves parent directory prefix)
normalize('~/foo/')            // → '~/foo'      (preserves home directory prefix)
normalize('https://a.com/')    // → 'https://a.com' (preserves URL protocol)
normalize('foo//bar///')       // → 'foo/bar'   (normalizes redundant slashes)
```

## API

### Input Types

All functions support flexible input forms:

```typescript
// Single string
ltrim('/foo')

// Variadic (multiple arguments)
join('foo', 'bar', 'baz')
trim('/foo', 'bar/')

// Array
ltrim(['/foo', 'bar'])

// Nested arrays
ltrim([['/foo'], ['bar', 'baz']])

// null/undefined/empty strings are automatically filtered
ltrim(['/foo', null, '', 'bar'])  // → 'foo/bar'

// Numbers are automatically converted to strings
join(['foo', 123, 'bar'])  // → 'foo/123/bar'
join('users', 456)         // → 'users/456'

// Other non-string types are silently filtered
join(['foo', {}, 'bar'])   // → 'foo/bar'
```

### Options

All functions accept an optional `options` parameter (as the last argument):

```typescript
interface SlashOptions {
  separator?: string;  // default '/'
}

// Using custom separator
ltrim('\\foo', { separator: '\\' })  // → 'foo'
join('foo', 'bar', { separator: '::' })  // → 'foo::bar'
join(['foo', 'bar'], { separator: '::' })  // → 'foo::bar'
```

### Function List

| Function | Description | Example |
|----------|-------------|---------|
| `ltrim` | Remove all leading separators | `ltrim('///foo')` → `'foo'` |
| `rtrim` | Remove all trailing separators | `rtrim('foo///')` → `'foo'` |
| `trim` | Remove all leading and trailing separators | `trim('///foo///')` → `'foo'` |
| `lpad` | Ensure leading separator | `lpad('foo')` → `'/foo'` |
| `rpad` | Ensure trailing separator | `rpad('foo')` → `'foo/'` |
| `pad` | Ensure leading and trailing separators | `pad('foo')` → `'/foo/'` |
| `join` | Join and preserve leading/trailing characteristics | `join('foo', 'bar')` → `'foo/bar'` |
| `normalize` | Smart path normalization | `normalize('./foo/')` → `'./foo'` |

### Prefixes Preserved by normalize

The `normalize` function preserves the following meaningful prefixes:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `/` | Absolute path | `/foo/` → `/foo` |
| `//` | Protocol-relative URL | `//cdn.com/` → `//cdn.com` |
| `./` | Current directory | `./foo/` → `./foo` |
| `../` | Parent directory | `../foo/` → `../foo` |
| `~/` | User home directory | `~/foo/` → `~/foo` |
| `x://` | URL protocol | `https://a.com/` → `https://a.com` |

### Important Behavior Notes

#### Pure Separator Input

When input contains only separators (e.g., `/`, `//`, `///`), each function behaves as follows:

| Function | Input `/` | Input `//` | Description |
|----------|-----------|------------|-------------|
| `trim` | `''` | `''` | Empty after removing separators |
| `ltrim` | `''` | `''` | Empty after removing separators |
| `rtrim` | `''` | `''` | Empty after removing separators |
| `lpad` | `''` | `''` | No actual content to pad |
| `rpad` | `''` | `''` | No actual content to pad |
| `pad` | `''` | `''` | No actual content to pad |
| `join` | `/` | `//` | Preserves leading/trailing characteristics |
| `normalize` | `/` | `//` | **Preserves meaningful prefix** |

**Key Difference**: `normalize` recognizes and preserves meaningful path prefixes, while other functions focus on separator operations.

#### When to Use normalize

If you need to preserve semantic path prefixes (such as root `/`, protocol-relative `//`, relative paths `./` `../`, home directory `~/`), use `normalize` instead of `trim`.

```typescript
// Need to preserve root directory semantics
normalize('/')     // → '/'
trim('/')          // → ''

// Need to preserve protocol-relative prefix
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
