# useChanged

Returns new value of given one only if it has changed, accordingly to given comparator logic.

Primarily meant to use with non-primitive values.
Using shallow comparison by default, this hook is basically a neat shorthand for `useMemo`:
```tsx
useMemo(() => ({ a, b }), [a, b])
// is equivalent to
useChanged({ a, b })
```
But some extra capabilities are available too, see below.

## Usage

### Basic usage
```tsx
import { useChanged } from '@nwbm/use-changes'

function MyComponent({ a, b }) {
  const value = useChanged({ a, b })
  // ^ `value` will be _referrentially_ same object as long as `a` and `b` don't change
  return <ChildComponent value={value} />
  // ^ So if ChildComponent is memoized, it won't re-render until `a` or `b` changes
  // Same applies to dependencies of useEffect, useMemo etc.
}
```

### Deep comparison

Deep comparison is also available out of the box:
```tsx
const value = useChanged(
  { a: [a], b: [b] }, 
  { eq: 'deep' }
)
```

### Custom comparator

```tsx
const value = useChanged(
  [a, b, c], 
  { eq: (next, prev) => next.length === prev.length }
)
```

### Compare by derived values

```tsx
const value = useChanged(
  [a, b, c],
  { by: value => value.length }
)
```

This option is useful when you want to compare by some derived value while not changing comparator logic.

Here, shallow comparator will still be used, so `value` will only change when `a` or `b` changes, but ignoring changes to `c` and `d`:
```tsx
const value = useChanged(
  { a: [a, b], b: [c, d] },
  { by: value => value.a }
)
```

Of course, both options can be combined:
```tsx
const value = useChanged(
  { a: { b: [c] }, d: { e: [f] }},
  { 
    by: value => value.a, 
    eq: 'deep' 
  }
)
```

## API

```ts
useChanged<T, K = T>(
  value: T, 
  options?: {
    by?: (value: T) => K,
    eq?: 'shallow' | 'deep' | (next: K, prev: K) => boolean = 'shallow'
  }
): T
```

| Argument   | Type                                                                                  | Required | Description                                                                                                                                                              
|------------|---------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| value      | T                                                                                     | Yes      | Value to compare                                                                                                                                                         | 
| options.by | `(x: T) => K`                                                                         | No       | Derives from `value` a new value to compare                                                                                                                              |  
| options.eq | <code>'shallow' <br/> &#124; 'deep' <br/> &#124; (next: K, prev: K) => boolean</code> | No       | How to compare next and prev values. <br/> Defaults to `'shallow'`. <br/>Uses comparators provided by [`fast-equals`](https://www.npmjs.com/package/fast-equals) package. | 
