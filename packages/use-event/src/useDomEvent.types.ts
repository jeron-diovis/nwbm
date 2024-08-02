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

type Hack<A, B> = Record<Exclude<keyof A, keyof B>, never>
type XHack<A, B> = A & Hack<A, B>
type Arg<T> = T extends (x: infer A) => unknown ? A : never

export interface IUseDomEvent {
  /*
   * filter - ok
   * hint - FAIL (string props)
   * random prop – perfect (highlight precisely, "does not exist in type...")
   * array prop - meh (error on overload level, "does not exist in type...")
   */
  /*<T extends Target, E extends keyof GetMap<T>>(
    el: T,
    events: {
      [K in E]?: Listener<GetMap<T>[K]>
    },
    options?: UseDomEventOptions<GetMap<T>[E]>
  ): void*/

  /*
   * filter - ok
   * hint - ok (only String.iterator, tolerable)
   * random prop – ok (highlight precisely, "not assignable to never")
   * array prop - meh (error on overload level,  "not assignable to never")
   */
  <T extends Target, M extends XMap<GetMap<T>>>(
    el: T,
    events: XHack<M, GetMap<T>>,
    options?: UseDomEventOptions<Arg<M[keyof M]>>
  ): void

  <T extends Target, E extends keyof GetMap<T>>(
    el: T,
    event: E | E[],
    callback: Listener<GetMap<T>[E]>,
    options?: UseDomEventOptions<GetMap<T>[E]>
  ): void
}

// ---

type GetMap<T> = T extends 'window'
  ? WindowEventMap
  : T extends 'document'
    ? DocumentEventMap
    : T extends 'visualViewport'
      ? NormalizedVisualViewportEventMap
      : HTMLElementEventMap

type XMap<M> = EventMap<{
  [K in keyof M]?: Listener<M[K]>
}>

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

/* A hack to improve a bit an intellisense for object literals.
 * Because of overloaded function interface, where one option uses objects and other one uses arrays,
 * typescript is confused when trying to suggest props for an object version.
 * Array is object too – so suggested keys include all array instance props,
 * which is super confusing for a user.
 * So we explicitly exclude all of those.
 *
 * This will NOT help when you already provided an invalid key to an object –
 * in that case, TS doesn't understand at all what kind of object is that,
 * and will suggest everything it knows, regardless of this hack.
 * But aside from that case, it really helps to clean up suggestions.
 *
 * Type is abstractly named `EventMap` just for it to look nice in TS hint and error messages. */
type EventMap<T> = Omit<T, keyof unknown[] | keyof string>
