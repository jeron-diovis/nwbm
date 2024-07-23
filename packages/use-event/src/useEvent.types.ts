/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from 'react'

// ---
//#region Emitter
type FnSubUnsub = (
  type: any,
  callback: (...args: any[]) => void,
  options?: any
) => void

type Emitter1 = {
  on: FnSubUnsub
  off: FnSubUnsub
}

type Emitter2 = {
  addEventListener: FnSubUnsub
  removeEventListener: FnSubUnsub
}

type Emitter3 = {
  addListener: FnSubUnsub
  removeListener: FnSubUnsub
}

export type Emitter = Emitter1 | Emitter2 | Emitter3

// ---

type InferEmitter<T> = T extends RefObject<infer U> ? U : T

type NormalizeEmitter<T> = T extends Emitter1
  ? T
  : T extends Emitter2
    ? { on: T['addEventListener']; off: T['removeEventListener'] }
    : T extends Emitter3
      ? { on: T['addListener']; off: T['removeListener'] }
      : never
//#endregion

type EventTarget = Emitter | RefObject<Emitter>

// ---
//#region Infer Event params
type EmitterParams<T> = Parameters<NormalizeEmitter<InferEmitter<T>>['on']>
type GetEventTypeFromTarget<T extends EventTarget> = Parameters<
  EmitterParams<T>[1]
>[0]
type GetEventOptionsFromTarget<T extends EventTarget> = EmitterParams<T>[2]

type GetEventNameConstraint<EventMap> = IfAny<EventMap, string, keyof EventMap>

type GetEventType<EventMap, Event, Target extends EventTarget> = IfAny<
  EventMap,
  GetEventTypeFromTarget<Target>,
  Event extends keyof EventMap
    ? NormalizeEventFromEventMap<EventMap[Event]>
    : never
>
//#endregion

// ---
//#region Options

export type UseEventOptions<FilterArg = unknown> = {
  enabled?: boolean
  filter?: (e: FilterArg) => boolean
}

type NormalizeCustomOptions<T> = IfNever<
  T,
  object,
  /* make sure custom opts won't intersect with reserved hook's options  */
  Omit<T, keyof UseEventOptions>
>

type BuildOptions<CustomOptions, FilterArg> = UseEventOptions<FilterArg> &
  NormalizeCustomOptions<
    /* Filter out any non-object option values –
     * like the `capture: boolean` overload for AddEventListenerOptions */
    Extract<CustomOptions, object>
  >
//#endregion

type SubscriptionArgs<EventMap, Event, Options, Target extends EventTarget> = [
  event: MaybeArray<Event>,
  callback: (e: GetEventType<EventMap, Event, Target>) => void,
  options?: BuildOptions<
    IfAny<Options, GetEventOptionsFromTarget<Target>>,
    GetEventType<EventMap, Event, Target>
  >,
]

export interface IUseEvent<
  /* Set defaults to `any`, so args from curried hook version
   * can always be passed to basic `useEvent` */
  EventMap extends object = any,
  Options extends object = any,
> {
  <
    Event extends GetEventNameConstraint<EventMap>,
    Target extends EventTarget = EventTarget,
  >(
    target: Target | null,
    ...args: SubscriptionArgs<EventMap, Event, Options, Target>
  ): void
}

export interface IUseEventCurry<
  EventMap extends object,
  Options extends object = never,
> {
  <Event extends keyof EventMap>(
    ...args: SubscriptionArgs<EventMap, Event, Options, EventTarget>
  ): void
}

// ---
//#region utils
type MaybeArray<T> = T | T[]

type IfNever<T, Y, N = T> = [T] extends [never] ? Y : N
type IfAny<T, Y, N = T> = 0 extends 1 & T ? Y : N

/* Approach to "EventsMap" type varies from lib to lib.
 * As map values can be either a callback function,
 * or an array of callback args,
 * or just an event type. */
type NormalizeEventFromEventMap<T> = T extends (e: infer U) => any
  ? U
  : T extends [infer E, ...any[]]
    ? E
    : T
//#endregion
