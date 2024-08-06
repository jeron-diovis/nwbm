import { deepEqual, shallowEqual } from 'fast-equals'

export type Comparator<T = unknown> = (a: T, b: T) => boolean

export type ComparatorOption<T> = Comparator<T> | 'shallow' | 'deep'

export const DEFAULT_COMPARATOR_OPTION: ComparatorOption<unknown> = 'shallow'

export function resolveComparator<T>(x: ComparatorOption<T>) {
  switch (x) {
    case 'shallow':
      return shallowEqual
    case 'deep':
      return deepEqual
    default:
      return x
  }
}
