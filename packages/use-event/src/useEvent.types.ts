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

type NormalizeOptions<CustomOptions, FilterArg> = UseEventOptions<FilterArg> &
  /* Hook special options must never be overridden by listener options.
   * (which is quite unlikely, but still should be considered) */
  Omit<
    /* Exclude any non-object option values –
     * like the `capture: boolean` overload for AddEventListenerOptions */
    Default<Extract<CustomOptions, object>, object>,
    keyof UseEventOptions
  >

//#endregion

type SubscriptionArgs<EventMap, Event, Options, Target extends EventTarget> = [
  event: MaybeArray<Event>,
  callback: (e: GetEventType<EventMap, Event, Target>) => void,
  options?: NormalizeOptions<
    Default<Options, GetEventOptionsFromTarget<Target>>,
    GetEventType<EventMap, Event, Target>
  >,
]

export interface IUseEvent<
  /* Set default to `any`, so args from curried hook version
   * can always be passed to basic `useEvent` */
  EventMap extends object = any,
  Options extends object = never,
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

type Default<T, D> = [T] extends [never] ? D : T

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

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
