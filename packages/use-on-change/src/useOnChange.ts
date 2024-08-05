import { useEffect, useRef } from 'react'

import { deepEqual, sameValueZeroEqual, shallowEqual } from 'fast-equals'

// ---

type Comparator<T = unknown> = (a: T, b: T) => boolean

// ---

type ComparatorOption<T> = Comparator<T> | 'plain' | 'shallow' | 'deep'

function resolveComparator<T>(x: ComparatorOption<T>) {
  switch (x) {
    case 'plain':
      return sameValueZeroEqual
    case 'shallow':
      return shallowEqual
    case 'deep':
      return deepEqual
    default:
      return x
  }
}

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
      const { runOnMount = false, eq = 'shallow', filter } = refOptions.current

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
