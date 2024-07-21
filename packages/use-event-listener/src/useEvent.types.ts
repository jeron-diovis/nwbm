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

export type Emitter = Emitter2 | Emitter1 | Emitter3
//#endregion

// ---
//#region Normalize Emitter

type GetEmitter<T> = T extends RefObject<infer U> ? U : T

type _NormalizedEmitter<T> = T extends Emitter1
  ? T
  : T extends Emitter2
    ? { on: T['addEventListener']; off: T['removeEventListener'] }
    : T extends Emitter3
      ? { on: T['addListener']; off: T['removeListener'] }
      : never

type NormalizedEmitter<T> = _NormalizedEmitter<GetEmitter<T>>
//#endregion

// ---
//#region Infer Event params
type MethodParams<T> = Parameters<NormalizedEmitter<T>['on']>
export type InferEventNames<T> = MethodParams<T>[0]
export type InferEventTypes<T> = Parameters<MethodParams<T>[1]>[0]
export type InferEventOptions<T> = MethodParams<T>[2]
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

type Target = Emitter | RefObject<Emitter>

export interface IUseEvent {
  <T extends Target>(
    target: T,
    event: MaybeArray<InferEventNames<T>>,
    callback: (e: InferEventTypes<T>) => void,
    options?: NormalizeOptions<InferEventOptions<T>, InferEventTypes<T>>
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

export interface IUseEventGeneric<EventMap, Options = object> {
  <E extends keyof EventMap>(
    target: Emitter,
    event: MaybeArray<E>,
    callback: (e: InferEventTypeFromMap<EventMap[E]>) => void,
    options?: NormalizeOptions<Options, InferEventTypeFromMap<EventMap[E]>>
  ): void
}

// ---
type MaybeArray<T> = T | T[]
