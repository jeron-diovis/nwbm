import { useRef } from 'react'

import {
  ComparatorOption,
  DEFAULT_COMPARATOR_OPTION,
  resolveComparator,
} from './utils'

export interface UseChangesOptions<T> {
  eq?: ComparatorOption<T>
}

export function useChanges<T>(
  value: T,
  options: UseChangesOptions<T> = {}
): { value: T; prev: T; changed: boolean } {
  const { eq = DEFAULT_COMPARATOR_OPTION } = options

  const ref = useRef<T>(value)
  const prev = ref.current
  const equals = resolveComparator(eq)
  const changed = !equals(value, prev)
  if (changed) {
    ref.current = value
  }
  return { value, prev, changed }
}

export function useChanged<T>(value: T, options: UseChangesOptions<T> = {}): T {
  const { value: next, prev, changed } = useChanges(value, options)
  return changed ? next : prev
}
