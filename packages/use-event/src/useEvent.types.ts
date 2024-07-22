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
// type InferEventNamesFromTarget<T extends EventTarget> = EmitterParams<T>[0]
type InferEventTypesFromTarget<T extends EventTarget> = Parameters<
  EmitterParams<T>[1]
>[0]
type InferEventOptionsFromTarget<T extends EventTarget> = EmitterParams<T>[2]
//#endregion

// ---
//#region Options

export type UseEventOptions<FilterArg = unknown> = {
  enabled?: boolean
  filter?: (e: FilterArg) => boolean
}

type EnsureObject<T> = [T] extends [never] ? object : T
type NormalizeOptions<T, FilterArg> = Omit<
  EnsureObject<Extract<T, object>>,
  keyof UseEventOptions
> &
  UseEventOptions<FilterArg>

//#endregion

/*export interface IUseEvent {
  <T extends EventTarget>(
    target: T | null,
    event: MaybeArray<InferEventNamesFromTarget<T>>,
    callback: (e: InferEventTypesFromTarget<T>) => void,
    options?: NormalizeOptions<
      InferEventOptionsFromTarget<T>,
      InferEventTypesFromTarget<T>
    >
  ): void
}*/

type GetEventNameConstraint<M> = keyof M extends never ? string : keyof M
// type GetEventName<M> = [M] extends [never] ? string : keyof M
type GetEventType<M, E, T extends EventTarget> = E extends keyof M
  ? NormalizeEventFromEventMap<M[E]>
  : InferEventTypesFromTarget<T>

// type GetEventOptions<O, T extends EventTarget> = never extends O
//   ? InferEventOptionsFromTarget<T>
//   : O
type GetEventOptions<O, T extends EventTarget> = [O] extends [never]
  ? InferEventOptionsFromTarget<T>
  : O

export interface IUseEvent<
  EventMap extends object = object,
  Options extends object = never,
> {
  <Event extends GetEventNameConstraint<EventMap>, Target extends EventTarget>(
    target: Target | null,
    event: MaybeArray<Event>,
    // callback: (e: InferEventTypeFromMap<M[E]>) => void,
    callback: (e: GetEventType<EventMap, Event, Target>) => void,
    // options?: NormalizeOptions<Options, InferEventTypeFromMap<M[E]>>
    options?: NormalizeOptions<
      GetEventOptions<Options, Target>,
      GetEventType<EventMap, Event, Target>
    >
  ): void
}

// ---

/* Approach to "EventsMap" type varies from lib to lib.
 * As map values can be either callback function,
 * or array of callback args,
 * or just an event type. */
type NormalizeEventFromEventMap<T> = T extends (e: infer U) => any
  ? U
  : T extends [infer E, ...any[]]
    ? E
    : T

export interface IUseEventMap<EventMap, Options = object> {
  <E extends keyof EventMap>(
    target: EventTarget | null,
    event: MaybeArray<E>,
    callback: (e: NormalizeEventFromEventMap<EventMap[E]>) => void,
    options?: NormalizeOptions<Options, NormalizeEventFromEventMap<EventMap[E]>>
  ): void
}

// ---
type MaybeArray<T> = T | T[]
