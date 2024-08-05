import { useEffect, useRef } from 'react'

import {
  ComparatorOption,
  DEFAULT_COMPARATOR_OPTION,
  resolveComparator,
} from './utils'

export type UseOnChangeOptions<T = unknown> = {
  eq?: ComparatorOption<T>
  runOnMount?: boolean
  enabled?: boolean
  filter?: (value: T, prev: T) => boolean
}

export function useOnChange<T>(
  value: T,
  callback: (current: T, prev: T) => void,
  { enabled = true, ...options }: UseOnChangeOptions<T> = {}
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
      } = refOptions.current

      const isFirstRun = refIsFirstRun.current
      refIsFirstRun.current = false

      if (!enabled) return

      const prev = previous.current

      if (isFirstRun) {
        if (runOnMount) callback(value, prev)
        return
      }

      const equals = resolveComparator(eq)
      if (equals(value, prev)) return
      previous.current = value
      if (filter?.(value, prev) === false) return
      callback(value, prev)
    },
    /* Depend on value – by definition.
     * Depend on `enabled` - as it's meant to change hook behavior, even if value is the same.
     * Ignore everything else */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, enabled]
  )
}
