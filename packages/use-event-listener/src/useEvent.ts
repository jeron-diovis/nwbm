import { useEffect, useRef } from 'react'

import { Emitter, IUseEvent, IUseEventGeneric } from './useEvent.types'

export const useEvent: IUseEvent = (target, event, listener, options) => {
  // ---
  // parse overload params
  type Fn = (...args: any[]) => void
  // let listener: Fn
  // let options: UseEventOptions
  // if (typeof third === 'function') {
  //   listener = third as Fn
  //   options = {}
  // } else {
  //   options = third as UseEventOptions
  //   listener = fourth as Fn
  // }

  const refListener = useRef<Fn>(listener)
  refListener.current = listener
  const refOptions = useRef(options)
  refOptions.current = options

  const refIsActive = useRef(true)

  useEffect(
    () => {
      if (!target) return undefined

      const el = 'current' in target ? target.current : (target as Emitter)
      if (!el) return undefined

      const { enabled, ...listenerOptions } = refOptions.current ?? {}
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
      refOptions.current?.enabled,
    ]
    /* eslint-enable */
  )
}

//#region createUseEvent
export const createUseEvent = <EventMap, Options = object>() =>
  useEvent as IUseEventGeneric<EventMap, Options>
//#endregion

// ---
//#region generic sub/unsub

type Fn = (...args: any[]) => void

function sub(target: Emitter, ...args: any[]) {
  if ('on' in target) {
    return (target.on as Fn)(...args)
  }

  if ('addEventListener' in target) {
    return (target.addEventListener as Fn)(...args)
  }

  if ('addListener' in target) {
    return (target.addListener as Fn)(...args)
  }

  throw new Error('Invalid subscription interface')
}

function unsub(target: Emitter, ...args: any[]) {
  if ('off' in target) {
    return (target.off as Fn)(...args)
  }

  if ('removeEventListener' in target) {
    return (target.removeEventListener as Fn)(...args)
  }

  if ('removeListener' in target) {
    return (target.removeListener as Fn)(...args)
  }

  throw new Error('Invalid subscription interface')
}
//#endregion
