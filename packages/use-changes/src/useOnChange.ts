import { useEffect, useRef } from 'react'

import {
  ComparatorOption,
  DEFAULT_COMPARATOR_OPTION,
  id,
  resolveComparator,
} from './utils'

export type UseOnChangeOptions<T = unknown, K = T> = {
  eq?: ComparatorOption<K>
  runOnMount?: boolean
  enabled?: boolean
  filter?: (value: K, prev: K) => boolean
  by?: (value: T) => K
}

export function useOnChange<T, K = T>(
  value: T,
  callback: (current: T, prev: T) => void,
  { enabled = true, ...options }: UseOnChangeOptions<T, K> = {}
): void {
  const refIsFirstRun = useRef(true)
  const previous = useRef(value)

  const refOptions = useRef(options)
  useEffect(() => {
    refOptions.current = options
  })

  useEffect(
    () => {
      const {
        runOnMount = false,
        eq = DEFAULT_COMPARATOR_OPTION,
        filter,
        by = id as NonNullable<typeof options.by>,
      } = refOptions.current

      const isFirstRun = refIsFirstRun.current
      refIsFirstRun.current = false

      if (!enabled) return

      const prev = previous.current

      if (isFirstRun) {
        if (runOnMount) callback(value, prev)
        return
      }

      const byValue = by(value)
      const byPrev = by(prev)
      const equals = resolveComparator(eq)
      if (equals(byValue, byPrev)) return
      previous.current = value
      /* Filter by _mapped_ values
       * Filter is meant to accompany diff calculation.
       * Usecase of "compare by mapped values, filter by original" feels too complicated,
       * hook becomes overloaded with multiple non-related to each other functions. */
      if (filter?.(byValue, byPrev) === false) return
      callback(value, prev)
    },
    /* Depend on value – by definition.
     * Depend on `enabled` - as it's meant to change hook behavior, even if value is the same.
     * Ignore everything else */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, enabled]
  )
}
