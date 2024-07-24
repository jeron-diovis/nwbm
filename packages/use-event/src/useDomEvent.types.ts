import { RefObject } from 'react'

import { UseEventOptions } from './useEvent.types'

export interface UseDomEventOptions<E extends Event = Event>
  extends UseEventOptions<E>,
    AddEventListenerOptions {}

/**
 * Tweaked version of `@react-hook/event`, which allows for:
 * - configuring listener options
 * - add listener on condition
 * - SSR-safe listeners for window / document, without need to manually check those globals existence
 *
 * @see https://github.com/jaredLunde/react-hook/blob/master/packages/event/README.md
 */
export interface IUseDomEvent {
  <T extends HTMLElement, E extends keyof HTMLElementEventMap>(
    el: RefOrVal<T> | null,
    event: E | E[],
    callback: ElementListener<E>,
    options?: UseDomEventOptions<HTMLElementEventMap[E]>
  ): void

  <T extends HTMLElement, M extends keyof HTMLElementEventMap>(
    el: RefOrVal<T> | null,
    events: {
      [E in M]?: ElementListener<E>
    },
    options?: UseDomEventOptions<HTMLElementEventMap[M]>
  ): void

  <E extends keyof WindowEventMap>(
    el: 'window',
    event: E | E[],
    callback: WindowListener<E>,
    options?: UseDomEventOptions<WindowEventMap[E]>
  ): void

  <E extends keyof WindowEventMap>(
    el: 'window',
    events: {
      [K in E]?: WindowListener<K>
    },
    options?: UseDomEventOptions<WindowEventMap[E]>
  ): void

  <E extends keyof DocumentEventMap>(
    el: 'document',
    event: E | E[],
    callback: DocumentListener<E>,
    options?: UseDomEventOptions<DocumentEventMap[E]>
  ): void

  <E extends keyof DocumentEventMap>(
    el: 'document',
    events: {
      [K in E]?: DocumentListener<K>
    },
    options?: UseDomEventOptions<DocumentEventMap[E]>
  ): void
}

// ---

export type RefOrVal<T> = RefObject<T> | T

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
