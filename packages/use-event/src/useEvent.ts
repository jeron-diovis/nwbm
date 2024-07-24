import { RefObject, useEffect, useRef } from 'react'

import { Emitter, Fn, IUseEvent, UseEventOptions } from './useEvent.types'

type Dict<T = unknown> = Record<string, T>

export const useEvent: IUseEvent = (target, eventOrListeners, ...rest) => {
  // ---
  // parse overloaded args
  let listeners: Fn | Dict<Fn>
  let events: string | string[]
  let options: UseEventOptions | undefined

  // useEvent(target, 'event', callback, options?)
  // useEvent(target, ['e1', 'e2'], callback, options?)
  if (typeof eventOrListeners === 'string' || Array.isArray(eventOrListeners)) {
    events = eventOrListeners
    listeners = rest[0] as Fn
    options = rest[1]
  }
  // useEvent(target, { event: callback }, options?)
  else {
    events = Object.keys(eventOrListeners)
    listeners = eventOrListeners as Dict<Fn>
    options = rest[0] as UseEventOptions
  }

  // ---

  const refListeners = useRef(listeners)
  const refOptions = useRef(options)
  useEffect(() => {
    refListeners.current = listeners
    refOptions.current = options
  })

  const refIsActive = useRef(true)

  // ---

  useEffect(
    () => {
      // ---
      // short circuit exit

      if (!target) return undefined

      const el = 'current' in target ? target.current : (target as Emitter)
      if (!el) return undefined

      const { enabled, filter, ...listenerOptions } = refOptions.current ?? {}
      if (enabled === false) return undefined

      // ---

      refIsActive.current = true

      // ---
      // resolve event listeners map
      const listeners = Object.entries(
        resolveListenersMap(refListeners.current, events)
      ).map(
        ([key, fn]) =>
          [key, createManagedListener(fn, refIsActive, refOptions)] as const
      )

      // ---
      // sub / unsub
      const toggleListeners = (enabled: boolean) => {
        const method = enabled ? sub : unsub
        listeners.forEach(([event, listener]) => {
          method(el, event, listener, listenerOptions)
        })
      }

      toggleListeners(true)
      return () => {
        refIsActive.current = false
        toggleListeners(false)
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      target,
      Array.isArray(events) ? events.join(' ') : events,
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

function resolveListenersMap(
  fns: Fn | Dict<Fn>,
  events: string | string[]
): Dict<Fn> {
  if (typeof fns !== 'function') {
    return fns
  }

  if (Array.isArray(events)) {
    return events.reduce((m, k) => ({ ...m, [k]: fns }), {})
  }

  return { [events]: fns }
}

function createManagedListener(
  fn: Fn,
  refActive: RefObject<boolean>,
  refOptions: RefObject<UseEventOptions | undefined>
): Fn {
  console.log('?', fn)
  return (...args: any[]) => {
    if (!refActive.current) return
    if (refOptions.current?.filter?.(args[0]) === false) return
    return fn(...args)
  }
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
