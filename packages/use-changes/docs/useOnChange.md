# useOnChange

Execute callback when the given value has changed, accordingly to given comparator logic.

## Usage
Basic usage:
```tsx
import { useOnChange } from '@nwbm/use-changes'

function MyComponent({ value }) {
  const [count, setCount] = useState(0)
  
  useOnChange(count, (next, prev) => {
    if (next > prev) {
      console.log('increased')
    } else {
      console.log('decreased')
    }
  })
}
```

### Shallow compare
By default, hook uses shallow comparison, so you can seamlessly compare simple objects/arrays:
```tsx
useOnChange({ a, b }, value => { 
  /* omly runs when `a` or `b` changes */ 
})
useOnChange([ a, b ], value => { /*...*/ })
```

### Deep compare
Deep comparison is also available out of the box:
```tsx
useOnChange(
  { a: [a], b: [b] }, 
  value => { /*...*/ },
  { eq: 'deep' }
)
```

### Custom comparator
```tsx
useOnChange(
  [a, b, c],
  value => { /*...*/ },
  { eq: (next, prev) => next.length === prev.length }
)
```

### Compare by derived values

```tsx
useOnChange(
  { a: [a, b], b: [c, d] },
  value => { /*...*/ },
  { by: value => value.a }
)
```
This option is useful when you want to compare by some derived value while not changing comparator logic.

In this example, shallow comparator will still be used, so `value` will only change when `a` or `b` changes, but ignoring changes to `c` and `d`.

Both options can be combined:

```tsx
useOnChange(
  { a: { b: [c] }, d: { e: [f] }},
  value => { /*...*/ },
  { 
    by: value => value.a, 
    eq: 'deep' 
  }
)
```

### Filtering changes
You can filter callback invocations to match only changes you're interested in:
```tsx
useOnChange(
  count,
  value => {
    console.log("it is twice as big as previous value:", value)
  },
  { filter: (next, prev) => next / prev === 2  }
)
```
Of course, this can be done inside callback itself.
This option is handy for more clean functional-like approach, when you have a separate ready-to-use predicate functions.

Compare these two equivalent examples:
```tsx
// straightforward:
useOnChange(
  count,
  value => {
    if (isEven(value)) {
      onChange(value)
    }
  }
)

// functional:
useOnChange(count, onChange, { filter: isEven })
```

> ⚠️ Note: when `by` option is provided, `filter` receives _derived_ values.
> If you want to both use `by` and filter callback invocations by _original_ values, do this inside callback itself.

### Run on mount

By default, hook will ignore the mount stage, and only run after succeeding updates (because on mount there are no changes yet to compare).

If you need to execute callback in mount stage too – i.e. make it behave just like `useEffect` normally does – you can enable it with option:

```tsx
useOnChange(value, callback, { runOnMount: true })
```

In this case, callback will be executed on mount, with an initial value both as `next` and `prev` params.

### Disable hook

Stop running all related hook logic without unmounting the containing component:

```tsx
useOnChange(value, callback, { enabled: someBooleanValue })
```
> ⚠️ Note: if value has been changed while hook was disabled, enabling hook will immediately trigger callback. 

### Layout stage

In some rare cases you may need to track changes specifically in layout stage, before anything is updated in UI.

For that there is a separate dedicated hook version:
```tsx
import { useOnChangeLayout } from '@nwmb/use-changes'
```

It has all the same options and logic, with exception that it uses `useLayoutEffect` internally instead of `useEffect`.
