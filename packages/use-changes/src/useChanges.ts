import { useRef } from 'react'

import {
  ComparatorOption,
  DEFAULT_COMPARATOR_OPTION,
  id,
  resolveComparator,
} from './utils'

export interface UseChangesOptions<T = unknown, K = T> {
  eq?: ComparatorOption<K>
  by?: (value: T) => K
}

export function useChanges<T, K = T>(
  value: T,
  options: UseChangesOptions<T, K> = {}
): { value: T; prev: T; changed: boolean } {
  const {
    eq = DEFAULT_COMPARATOR_OPTION,
    by = id as NonNullable<typeof options.by>,
  } = options

  const ref = useRef<T>(value)
  const prev = ref.current

  const equals = resolveComparator(eq)
  const changed = !equals(by(value), by(prev))

  if (changed) {
    ref.current = value
  }
  return { value, prev, changed }
}

export function useChanged<T, K = T>(
  value: T,
  options: UseChangesOptions<T, K> = {}
): T {
  const { value: next, prev, changed } = useChanges(value, options)
  return changed ? next : prev
}
