# useChanges

Low-level hook, that compares next and previous value, and returns "meta" data about the comparison: current value, previous value, and whether the value has
changed.

## Usage

```tsx
import { useChanges } from '@nwbm/use-changes'

function MyComponent({ a, b }) {
  const { value, prev, changed } = useChanges({ a, b })
  ...
}
```

## API

```ts
useChanged<T, K = T>(
  value: T,
  options?: {
    by?: (value: T) => K,
    eq?: 'shallow' | 'deep' | (next: K, prev: K) => boolean = 'shallow'
  }
): { 
  value: T, 
  prev: T, 
  changed: boolean 
}
```

| Argument   | Type                                                                                  | Required | Description                                                                                                                                                              
|------------|---------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| value      | T                                                                                     | Yes      | Value to compare                                                                                                                                                         | 
| options.by | `(x: T) => K`                                                                         | No       | Derives from `value` a new value to compare                                                                                                                              |  
| options.eq | <code>'shallow' <br/> &#124; 'deep' <br/> &#124; (next: K, prev: K) => boolean</code> | No       | How to compare next and prev values. <br/> Defaults to `'shallow'`. <br/>Uses comparators provided by [`fast-equals`](https://www.npmjs.com/package/fast-equals) package. | 
