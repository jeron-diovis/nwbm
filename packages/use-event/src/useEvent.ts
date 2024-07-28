import { RefObject, useEffect, useRef } from 'react'

import { Emitter, Fn, IUseEvent, UseEventOptions } from './useEvent.types'

export const useEvent: IUseEvent = (...args: any[]) => {
  // ---
  // parse overloaded args
  const [target, eventOrListeners, ...rest] = args

  let listeners: Fn | Listeners
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
    listeners = eventOrListeners as Listeners
    options = rest[0] as UseEventOptions
  }

  // ---

  const refListeners = useRef(listeners)
  // const refEvents = useRef(events)
  const refOptions = useRef(options)
  // useEffect(() => {
  //   refListeners.current = listeners
  //   refEvents.current = events
  //   refOptions.current = options
  // })

  refListeners.current = listeners
  // refEvents.current = events
  refOptions.current = options

  const refActive = useRef(true)

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

      refActive.current = true

      // ---
      // resolve event listeners map
      const listeners = Object.entries(
        resolveListenersMap(refListeners, events)
      ).map(
        ([key, fn]) => [key, toManagedCb(fn, refActive, refOptions)] as const
      )

      // ---
      // sub / unsub
      const toggleListeners = (enabled: boolean) => {
        const method = enabled ? sub : unsub
        listeners.forEach(([event, cb]) => {
          method(el, event, cb, listenerOptions)
        })
      }

      toggleListeners(true)
      return () => {
        refActive.current = false
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
      options?.enabled,
    ]
    /* eslint-enable */
  )
}

// ---
//#region resolve listeners
/* Listeners map is defined as { key?: Fn }.
 * Technically this is equivalent to "{ key?: Fn | undefined }" (for some weird TS reason).
 * Which means, user can pass in a listeners map full of undefined */
type Listeners = Record<string, Fn | undefined>

function resolveListenersMap(
  ref: RefObject<Fn | Listeners>,
  events: string | string[]
): Record<string, Fn> {
  if (ref.current === null) return {}

  const eventNames =
    // useEvent(target, { event: callback })
    typeof ref.current !== 'function'
      ? Object.keys(ref.current)
      : // useEvent(target, ['e1', 'e2'], callback)
        Array.isArray(events)
        ? events
        : // useEvent(target, 'event', callback)
          [events]

  return eventNames.reduce(
    (m, k) => ({
      ...m,
      [k]: (...args: any[]) => {
        const curr = ref.current
        const fn = typeof curr === 'function' ? curr : curr?.[k]
        return fn?.(...args)
      },
    }),
    {}
  )
}

function toManagedCb(
  fn: Fn,
  refActive: RefObject<boolean>,
  refOptions: RefObject<UseEventOptions | undefined>
): Fn {
  return (...args: any[]) => {
    /* Skip listener invocation if hook is already not active at that moment.
     * I.e., prevent cases of "can't update state on unmounted component" with bubbling events. */
    if (!refActive.current) return

    /* User's own logic of skipping listener invocation. */
    if (refOptions.current?.filter?.(args[0]) === false) return

    return fn(...args)
  }
}
//#endregion

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
