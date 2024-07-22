/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from 'react'

// ---
//#region Emitter
type FnSubUnsub = (
  type: string,
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
type InferEventNamesFromTarget<T extends EventTarget> = EmitterParams<T>[0]
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

type NormalizeOptions<T, FilterArg> = Omit<T, keyof UseEventOptions> &
  UseEventOptions<FilterArg>

//#endregion

export interface IUseEvent {
  <T extends EventTarget>(
    target: T | null,
    event: MaybeArray<InferEventNamesFromTarget<T>>,
    callback: (e: InferEventTypesFromTarget<T>) => void,
    options?: NormalizeOptions<
      InferEventOptionsFromTarget<T>,
      InferEventTypesFromTarget<T>
    >
  ): void
}

// ---

/* Approach to "EventsMap" type varies from lib to lib.
 * As map values can be either callback function,
 * or array of callback args,
 * or just an event type. */
type InferEventTypeFromMap<T> = T extends (e: infer U) => any
  ? U
  : T extends [infer E, ...any[]]
    ? E
    : T

export interface IUseEventMap<EventMap, Options = object> {
  <E extends keyof EventMap>(
    target: EventTarget | null,
    event: MaybeArray<E>,
    callback: (e: InferEventTypeFromMap<EventMap[E]>) => void,
    options?: NormalizeOptions<Options, InferEventTypeFromMap<EventMap[E]>>
  ): void
}

// ---
type MaybeArray<T> = T | T[]
