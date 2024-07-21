import { useEffect, useRef } from 'react'

import {
  IUseEventListener,
  RefOrVal,
  UseEventListenerOptions,
} from './useEventListener.types'

export const useEventListener: IUseEventListener = (
  target: RefOrVal<HTMLElement> | 'window' | 'document',
  event: string | string[],
  third: unknown,
  fourth?: unknown
) => {
  // ---
  // parse overload params
  type Fn = (...args: any[]) => void
  let listener: Fn
  let options: UseEventListenerOptions
  if (typeof third === 'function') {
    listener = third as Fn
    options = {}
  } else {
    options = third as UseEventListenerOptions
    listener = fourth as Fn
  }

  // ---

  const refListener = useRef(listener)
  refListener.current = listener
  const refOptions = useRef(options)
  refOptions.current = options
  const refIsActive = useRef(true)

  // ---

  useEffect(
    () => {
      /* eslint-disable no-nested-ternary */
      const el =
        target === 'window'
          ? window
          : target === 'document'
            ? document
            : 'current' in target
              ? target.current
              : target
      /* eslint-enable */

      if (el === null) return undefined

      const { enabled, ...listenerOptions } = refOptions.current ?? {}
      if (enabled === false) return undefined

      refIsActive.current = true

      const listener = (...args: any[]) => {
        // ignore bubbling event if component was already unmounted or subscription changed
        if (!refIsActive.current) return
        if (refOptions.current.filter?.(args[0]) === false) return
        refListener.current(...args)
      }

      const events = Array.isArray(event) ? event : [event]

      events.forEach(event => {
        el.addEventListener(event, listener, listenerOptions)
      })
      return () => {
        refIsActive.current = false
        events.forEach(event => {
          el.removeEventListener(event, listener, listenerOptions)
        })
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      target,
      Array.isArray(event) ? event.join(' ') : event,
      /* Depend only on this option – as it's the one meant to disable the entire things */
      refOptions.current.enabled,
    ]
    /* eslint-enable */
  )
}
