import { useCallback, useEffect, useMemo, useRef } from 'react'

import { Emitter, IUseEvent2 } from './useEvent.types'

type Fn = (...args: any[]) => any
type Dict<T = unknown> = Record<string, T>

/*export function useLatestCallback<T extends Fn>(fn: T): T {
  const refFn = useRef(fn)
  useEffect(() => {
    refFn.current = fn
  }, [fn])

  return useCallback((...args: any[]) => refFn.current(...args), []) as T
}

export function useLatestCallbacks<T extends Dict<Fn>>(fns: T): T {
  const refFns = useRef(fns)
  useEffect(() => {
    refFns.current = fns
  }, [fns])

  return useMemo(() => {
    return Object.keys(refFns.current).reduce((m, key: keyof T) => {
      m[key] = ((...args: any[]) =>
        refFns.current[key]?.(...args)) as T[keyof T]
      return m
    }, {} as T)
  }, [Object.keys(fns).join(' ')])
}*/

export const useEvent2: IUseEvent2 = (target, listeners, options) => {
  // const sListeners = useLatestCallbacks(listeners)
  const refListeners = useRef(listeners)
  const refOptions = useRef(options)
  useEffect(() => {
    refListeners.current = listeners
    refOptions.current = options
  })

  const refIsActive = useRef(true)

  useEffect(
    () => {
      if (!target) return undefined

      const el = 'current' in target ? target.current : (target as Emitter)
      if (!el) return undefined

      const { enabled, filter, ...listenerOptions } = refOptions.current ?? {}
      if (enabled === false) return undefined

      refIsActive.current = true

      const listeners = Object.entries(refListeners.current).map(
        ([key, fn]) =>
          [
            key,
            (...args: any[]) => {
              if (!refIsActive.current) return
              if (refOptions.current?.filter?.(args[0]) === false) return
              ;(fn as Fn)(...args)
            },
          ] as const
      )

      listeners.forEach(([event, listener]) => {
        sub(el, event, listener, listenerOptions)
      })

      return () => {
        refIsActive.current = false

        listeners.forEach(([event, listener]) => {
          unsub(el, event, listener, listenerOptions)
        })
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      target,
      Object.keys(listeners).join(' '),
      // sListeners,
      /* Depend only on this option, as it's specially meant to change behavior of effect */
      refOptions.current?.enabled,
    ]
    /* eslint-enable */
  )
}

// ---
//#region generic sub/unsub

function sub(target: Emitter, ...args: any[]) {
  const fn =
    'on' in target
      ? target.on
      : 'addEventListener' in target
        ? target.addEventListener
        : target.addListener

  return (fn as Fn).call(target, ...args)
}

function unsub(target: Emitter, ...args: any[]) {
  const fn =
    'off' in target
      ? target.off
      : 'removeEventListener' in target
        ? target.removeEventListener
        : target.removeListener

  return (fn as Fn).call(target, ...args)
}

//#endregion
