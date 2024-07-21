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
    el: RefOrVal<T>,
    event: E | E[],
    callback: ElementListener<E>
  ): void

  <T extends HTMLElement, E extends keyof HTMLElementEventMap>(
    el: RefOrVal<T>,
    event: E | E[],
    options: UseDomEventOptions<HTMLElementEventMap[E]>,
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
    options: UseDomEventOptions<WindowEventMap[E]>,
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
    options: UseDomEventOptions<DocumentEventMap[E]>,
    callback: DocumentListener<E>
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
