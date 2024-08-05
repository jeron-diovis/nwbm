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
}

export function useOnChange<T>(
  value: T,
  callback: (current: T, prev: T) => void,
  options: UseOnChangeOptions<T> = {}
): void {
  const { eq = 'shallow', runOnMount = false } = options

  const isFirstRun = useRef(true)
  const previous = useRef(value)

  useEffect(
    () => {
      const prev = previous.current
      if (isFirstRun.current && runOnMount) {
        isFirstRun.current = false
        callback(value, prev)
        return
      }

      const compare = resolveComparator(eq)
      if (!compare(value, prev)) {
        previous.current = value
        callback(value, prev)
      }
    },
    /* Don't depend on callback, because it doesn't matter. It's only about value.
     * Don't depend on comparator. No idea what's the real usecase for changing comparators between updates.
     * Don't depend on `runOnMount`, as it's by definition only for the very first render.
     * Depend on value – it will save runs of the effect for plain values. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  )
}
