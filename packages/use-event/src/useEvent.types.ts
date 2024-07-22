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

type GetEventNameConstraint<EventMap> = keyof EventMap extends never
  ? string
  : keyof EventMap

type GetEventType<
  EventMap,
  Event,
  Target extends EventTarget,
> = Event extends keyof EventMap
  ? NormalizeEventFromEventMap<EventMap[Event]>
  : GetEventTypeFromTarget<Target>
//#endregion

// ---
//#region Options

export type UseEventOptions<FilterArg = unknown> = {
  enabled?: boolean
  filter?: (e: FilterArg) => boolean
}

type NormalizeOptions<T, FilterArg> = UseEventOptions<FilterArg> &
  /* Hook special options must never be overridden by listener options.
   * (which is quite unlikely, but still should be considered) */
  Omit<
    /* Exclude any non-object option values –
     * like the `capture: boolean` overload for AddEventListenerOptions */
    Default<Extract<T, object>, object>,
    keyof UseEventOptions
  >

//#endregion

export interface IUseEvent<
  EventMap extends object = object,
  Options extends object = never,
> {
  <Event extends GetEventNameConstraint<EventMap>, Target extends EventTarget>(
    target: Target | null,
    event: MaybeArray<Event>,
    callback: (e: GetEventType<EventMap, Event, Target>) => void,
    options?: NormalizeOptions<
      Default<Options, GetEventOptionsFromTarget<Target>>,
      GetEventType<EventMap, Event, Target>
    >
  ): void
}

// ---
//#region utils
type MaybeArray<T> = T | T[]

type Default<T, D> = [T] extends [never] ? D : T

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
