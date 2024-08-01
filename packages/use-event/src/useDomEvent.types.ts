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

  <T extends HTMLElement, E extends keyof HTMLElementEventMap>(
    el: RefOrVal<T> | null,
    events: IntellisenseHackForObject<{
      [K in E]?: ElementListener<K>
    }>,
    options?: UseDomEventOptions<HTMLElementEventMap[E]>
  ): void

  <E extends keyof WindowEventMap>(
    el: 'window',
    event: E | E[],
    callback: WindowListener<E>,
    options?: UseDomEventOptions<WindowEventMap[E]>
  ): void

  <E extends keyof WindowEventMap>(
    el: 'window',
    events: IntellisenseHackForObject<{
      [K in E]?: WindowListener<K>
    }>,
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
    events: IntellisenseHackForObject<{
      [K in E]?: DocumentListener<K>
    }>,
    options?: UseDomEventOptions<DocumentEventMap[E]>
  ): void

  <E extends keyof VisualViewportEventMap>(
    el: 'visualViewport',
    event: E | E[],
    callback: VisualViewportListener<E>,
    options?: UseDomEventOptions<NormalizedVisualViewportEventMap[E]>
  ): void

  <E extends keyof VisualViewportEventMap>(
    el: 'visualViewport',
    events: IntellisenseHackForObject<{
      [K in E]?: VisualViewportListener<K>
    }>,
    options?: UseDomEventOptions<NormalizedVisualViewportEventMap[E]>
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
type VisualViewportListener<E extends keyof VisualViewportEventMap> = Listener<
  NormalizedVisualViewportEventMap[E]
>

// ---

type NormalizedVisualViewportEventMap = {
  [K in keyof VisualViewportEventMap]: VisualViewportEvent<K>
}

type VisualViewportEvent<E extends keyof VisualViewportEventMap> = Overwrite<
  VisualViewportEventMap[E],
  {
    target: VisualViewport
    srcElement: VisualViewport
    currentTarget: null
  }
>

// ---

type Overwrite<T extends object, O extends { [K in keyof T]?: unknown }> = Omit<
  T,
  keyof O
> &
  O

type IntellisenseHackForObject<T> = Omit<T, keyof unknown[]>
