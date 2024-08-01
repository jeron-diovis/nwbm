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

export type EventTarget = Emitter | RefObject<Emitter>

// ---
//#region Infer Event params
type EmitterParams<T> = Parameters<NormalizeEmitter<InferEmitter<T>>['on']>
type GetEventTypeFromTarget<T extends EventTarget> = Parameters<
  EmitterParams<T>[1]
>[0]
type GetEventOptionsFromTarget<T extends EventTarget> = EmitterParams<T>[2]

type GetEventType<
  EventsMap,
  Event,
  Target extends EventTarget = EventTarget,
> = IfAny<
  EventsMap,
  GetEventTypeFromTarget<Target>,
  Event extends keyof EventsMap
    ? /* Some event maps are defined in "{ name?: callback }" format.
       * Inferring event type from an optional callback will result in an optional value.
       * Yet in runtime it's obviously impossible. So patch inferred type to exclude `undefined` values. */
      Exclude<NormalizeEventFromEventsMap<EventsMap[Event]>, undefined>
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

type HookOptions<
  EventsMap,
  EventNames extends keyof EventsMap,
  Options,
  Target extends EventTarget = EventTarget,
> = BuildOptions<
  IfAny<Options, GetEventOptionsFromTarget<Target>>,
  GetEventType<EventsMap, EventNames, Target>
>
//#endregion

export interface IUseEvent<
  /* Set defaults to `any`, so args from curried hook version
   * can always be passed to basic `useEvent` */
  EventsMap extends object = any,
  Options extends object = any,
> {
  <
    SubMap extends EventsMapConstraint<EventsMap, SubMap>,
    Target extends EventTarget = EventTarget,
  >(
    target: Target | null,
    events: SubMap,
    options?: HookOptions<SubMap, keyof SubMap, Options, Target>
  ): void

  <EventName extends keyof EventsMap, Target extends EventTarget = EventTarget>(
    target: Target | null,
    event: EventNameConstraint<EventName>,
    callback: (e: GetEventType<EventsMap, EventName, Target>) => void,
    options?: HookOptions<EventsMap, EventName, Options, Target>
  ): void
}

export interface IUseEventPartial<
  EventsMap extends object,
  Options extends object = never,
> {
  <SubMap extends EventsMapConstraint<EventsMap, SubMap>>(
    events: SubMap,
    options?: HookOptions<SubMap, keyof SubMap, Options>
  ): void

  <EventName extends keyof EventsMap>(
    event: EventNameConstraint<EventName>,
    callback: (e: GetEventType<EventsMap, EventName>) => void,
    options?: HookOptions<EventsMap, EventName, Options>
  ): void
}

export interface ICreateUseEvent {
  <EventsMap extends object, Options extends object = never>(
    useTarget: () => EventTarget | null
  ): IUseEventPartial<NormalizeEventsMap<EventsMap>, Options>

  <EventsMap extends object, Options extends object = never>(): IUseEvent<
    EventsMap,
    Options
  >
}

// ---
//#region utils
export type Fn = (...args: any[]) => any

type IfNever<T, Y, N = T> = [T] extends [never] ? Y : N
type IfAny<T, Y, N = T> = 0 extends 1 & T ? Y : N

/* Approach to "EventsMap" type varies from lib to lib.
 * As map values can be either a callback function,
 * or an array of callback args,
 * or just an event type. */
type NormalizeEventFromEventsMap<T> = T extends (e: infer U) => any
  ? U
  : T extends [infer E, ...any[]]
    ? E
    : T

type NormalizeEventsMap<M> = {
  [E in keyof M]?: (e: NormalizeEventFromEventsMap<Required<M>[E]>) => void
}

// ---

type EventsMapConstraint<EventsMap, SubMap> = NormalizeEventsMap<EventsMap> &
  IntellisenseHackForObject<SubMap, EventsMap>

type EventNameConstraint<E> = E | IntellisenseHackForArray<E[]>

type IntellisenseHackForObject<T1, T2> = Record<
  Exclude<keyof T1, keyof T2>,
  never
>
type IntellisenseHackForArray<T> = Omit<T, keyof unknown[]>

//#endregion
