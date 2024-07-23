import { useEffect, useRef } from 'react'

import { Emitter, IUseEvent } from './useEvent.types'

type Fn = (...args: any[]) => void

export const useEvent: IUseEvent = (target, event, listener, options) => {
  const refListener = useRef<Fn>(listener)
  const refOptions = useRef(options)
  useEffect(() => {
    refListener.current = listener
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

      const listener = (...args: any[]) => {
        if (!refIsActive.current) return
        if (refOptions.current?.filter?.(args[0]) === false) return
        refListener.current(...args)
      }

      const events = Array.isArray(event) ? event : [event]

      events.forEach(event => {
        sub(el, event, listener, listenerOptions)
      })

      return () => {
        refIsActive.current = false

        events.forEach(event => {
          unsub(el, event, listener, listenerOptions)
        })
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      target,
      Array.isArray(event) ? event.join(' ') : event,
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
