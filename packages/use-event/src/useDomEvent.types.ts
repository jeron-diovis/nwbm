import { RefObject } from 'react'

import { UseEventOptions } from './useEvent.types'

export interface UseDomEventOptions<E = Event>
  extends UseEventOptions<E>,
    AddEventListenerOptions {}

export type Target =
  | 'window'
  | 'document'
  | 'visualViewport'
  | RefOrVal<HTMLElement>
  | null

export interface IUseDomEvent {
  <T extends Target, M extends ListenersMap<GetEventsMap<T>>>(
    el: T,
    events: Listeners<M, GetEventsMap<T>>,
    options?: UseDomEventOptions<
      GetFirstArg<LookupByKeys<M, ListenersMap<GetEventsMap<T>>>>
    >
  ): void

  <T extends Target, E extends keyof GetEventsMap<T>>(
    el: T,
    event: E | E[],
    callback: Listener<GetEventsMap<T>[E]>,
    options?: UseDomEventOptions<GetEventsMap<T>[E]>
  ): void

  <
    EventType extends CustomEvent = CustomEvent<unknown>,
    EventName extends string = string,
  >(
    el: Target,
    event: EventName | EventName[],
    callback: Listener<EventType>,
    options?: UseDomEventOptions<EventType>
  ): void
}

// ---

type GetEventsMap<T extends Target> = T extends 'window'
  ? WindowEventMap
  : T extends 'document'
    ? DocumentEventMap
    : T extends 'visualViewport'
      ? NormalizedVisualViewportEventMap
      : HTMLElementEventMap

type ListenersMap<EventsMap> = {
  [E in keyof EventsMap]?: Listener<EventsMap[E]>
}

type Listener<E> = (event: E) => void

// ---

type NormalizedVisualViewportEventMap = {
  [K in keyof VisualViewportEventMap]: VisualViewportEvent<K>
}

type VisualViewportEvent<E extends keyof VisualViewportEventMap> = Overwrite<
  VisualViewportEventMap[E],
  /* from practical experience, this is how these props always are: */
  {
    target: VisualViewport
    srcElement: VisualViewport
    currentTarget: null
  }
>

// ---

type RefOrVal<T> = RefObject<T> | T

type Overwrite<T extends object, O extends { [K in keyof T]?: unknown }> = Omit<
  T,
  keyof O
> &
  O

type GetFirstArg<T> = T extends (x: infer A) => unknown ? A : never

type LookupByKeys<Source, Target> = keyof Source extends keyof Target
  ? Target[keyof Source]
  : never

/*
 * A hack to make excess props validation work for generics.
 * @see https://stackoverflow.com/a/78798427/3437433
 *
 * Name it `Listeners` just to make it look nice in TS error messages.
 */
type Listeners<A, B> =
  Exclude<keyof A, keyof B> extends never
    ? A
    : A & Record<Exclude<keyof A, keyof B>, never>
