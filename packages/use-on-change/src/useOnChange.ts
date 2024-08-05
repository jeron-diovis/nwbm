import { useEffect, useRef } from 'react'

import { shallowEqual } from 'fast-equals'

// ---

type Comparator<T = unknown> = (a: T, b: T) => boolean

// ---

export type UseOnChangeOptions<T = unknown> = {
  eq?: Comparator<T>
  runOnMount?: boolean
}

export function useOnChange<T>(
  value: T,
  callback: (current: T, prev: T) => void,
  options: UseOnChangeOptions<T> = {}
): void {
  const { eq = shallowEqual, runOnMount = false } = options

  const isFirstRun = useRef(true)
  const previous = useRef(value)

  useEffect(
    () => {
      const prev = previous.current
      if (isFirstRun.current && runOnMount) {
        isFirstRun.current = false
        callback(value, prev)
      } else if (!eq(value, prev)) {
        previous.current = value
        callback(value, prev)
      }
    },
    /* Don't depend on callback or comparator. It's only about value.
     * Don't depend on `runOnMount`, as it's only for the very first render. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  )
}
