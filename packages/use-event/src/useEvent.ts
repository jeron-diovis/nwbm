import { useEffect, useRef } from 'react'

import { Emitter, Fn, IUseEvent, UseEventOptions } from './useEvent.types'

type Dict<T = unknown> = Partial<Record<string, T>>

export const useEvent: IUseEvent = (target, eventOrListeners, ...rest) => {
  let listeners: Fn | Dict<Fn>
  let event: string | string[] = []
  let options: UseEventOptions | undefined

  if (typeof eventOrListeners === 'string' || Array.isArray(eventOrListeners)) {
    event = eventOrListeners
    listeners = rest[0] as Fn
    options = rest[1]
  } else {
    event = Object.keys(eventOrListeners)
    listeners = eventOrListeners
    options = rest[0] as UseEventOptions
  }

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

      const fns = refListeners.current
      const listeners = Object.entries(
        typeof fns !== 'function'
          ? fns
          : Array.isArray(event)
            ? event.reduce((m, k) => ({ ...m, [k]: fns }), {})
            : { [event]: fns }
      ).map(
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
      getEventNameDependency(event),
      /* Depend only on this option, as it's specially meant to change behavior of effect.
       * Other ones are _supposed_ to NOT change upon hook lifetime.
       * Because what's the usecase for that?
       * Like, change listener phase from capture to bubble back and forth – what's the point? */
      refOptions.current?.enabled,
    ]
    /* eslint-enable */
  )
}

// ---

function getEventNameDependency(x: string | string[] | Dict) {
  if (typeof x === 'string') return x
  if (Array.isArray(x)) return x.join(' ')
  return Object.keys(x).join(' ')
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
