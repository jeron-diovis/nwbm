import { RefObject, useEffect, useRef } from 'react'

export type UseEventListenerOptions = AddEventListenerOptions & {
  when?: boolean
}

/**
 * Tweaked version of `@react-hook/event`, which allows for:
 * - configuring listener options
 * - add listener on condition
 * - SSR-safe listeners for window / document, without need to manually check those globals existence
 *
 * @see https://github.com/jaredLunde/react-hook/blob/master/packages/event/README.md
 */
type IUseEventListener = {
  <T extends HTMLElement, E extends keyof HTMLElementEventMap>(
    el: RefOrVal<T>,
    event: E | E[],
    callback: ElementListener<E>
  ): void

  <T extends HTMLElement, E extends keyof HTMLElementEventMap>(
    el: RefOrVal<T>,
    event: E | E[],
    options: UseEventListenerOptions,
    callback: ElementListener<E>
  ): void

  <E extends keyof WindowEventMap>(
    el: 'window', // use string instead of actual value to make it SSR-safe, by resolving value lazily inside useEffect
    event: E | E[],
    callback: WindowListener<E>
  ): void

  <E extends keyof WindowEventMap>(
    el: 'window',
    event: E | E[],
    options: UseEventListenerOptions,
    callback: WindowListener<E>
  ): void

  <E extends keyof DocumentEventMap>(
    el: 'document',
    event: E | E[],
    callback: DocumentListener<E>
  ): void

  <E extends keyof DocumentEventMap>(
    el: 'document',
    event: E | E[],
    options: UseEventListenerOptions,
    callback: DocumentListener<E>
  ): void
}

// ---

type RefOrVal<T> = RefObject<T> | T

type Listener<E> = (event: E) => void

type ElementListener<E extends keyof HTMLElementEventMap> = Listener<
  HTMLElementEventMap[E]
>
type WindowListener<E extends keyof WindowEventMap> = Listener<
  WindowEventMap[E]
>
type DocumentListener<E extends keyof DocumentEventMap> = Listener<
  DocumentEventMap[E]
>

// ---

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

      const { when, ...listenerOptions } = refOptions.current ?? {}
      if (when === false) return undefined

      refIsActive.current = true

      const listener = (...args: any[]) => {
        // ignore bubbling event if component was already unmounted or subscription changed
        if (!refIsActive.current) return
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
      refOptions.current.when,
    ]
    /* eslint-enable */
  )
}
