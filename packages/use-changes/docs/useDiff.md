# useDiff

Derives new value from current and previous values of the given one.

## Usage

```tsx
import { useDiff } from '@nwbm/use-changes'

const isIncreased = useDiff(someNumber, (next, prev) => next > prev)
```

Callback is called only when given value changes (accordingly to provided comparator) and once on the very first run (to get the initial value).

To distinguish the initial run from the rest, in case it matters, the third boolean argument is provided to callback:
```tsx
const diff = useDiff(someNumber, (next, prev, isInitial) => isInitial ? 0 : next - prev)
```

## API

```ts
useDiff<T, R, K = T>(
  value: T,
  map: (next: T, prev: T, isInitial: boolean) => R,
  options?: {
    by?: (value: T) => K,
    eq?: 'shallow' | 'deep' | (next: K, prev: K) => boolean = 'shallow'
  }
): R
```

| Argument   | Type                                                                                  | Required | Description                                                                                                                                                               
|------------|---------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| value      | T                                                                                     | Yes      | Value to compare                                                                                                                                                          | 
| map        | (next: T, prev: T, isInitial: boolean) => R                                           | Yes      | How to get the result value from current and previous                                                                                                                     | 
| options.by | `(x: T) => K`                                                                         | No       | Derives from `value` a new value to pass to comparator                                                                                                                    |  
| options.eq | <code>'shallow' <br/> &#124; 'deep' <br/> &#124; (next: K, prev: K) => boolean</code> | No       | How to compare next and prev values. <br/> Defaults to `'shallow'`. <br/>Uses comparators provided by [`fast-equals`](https://www.npmjs.com/package/fast-equals) package. | 
