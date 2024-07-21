import { RefObject } from 'react'

// ---
//#region Emitter

type FnSub = (
  type: unknown,
  listener: (...args: any[]) => void,
  options?: unknown
) => void

type FnUnSub = (
  type: unknown,
  listener: (...args: any[]) => void,
  options?: unknown
) => void

type Emitter1 = {
  on: FnSub
  off: FnUnSub
}

type Emitter2 = {
  addEventListener: FnSub
  removeEventListener: FnUnSub
}

type Emitter3 = {
  addListener: FnSub
  removeListener: FnUnSub
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

export type InferEventNames<T> = Parameters<NormalizedEmitter<T>['on']>[0]

export type InferEventTypes<T> = Parameters<
  Parameters<NormalizedEmitter<T>['on']>[1]
>[0]

export type InferEventOptions<T> = Parameters<NormalizedEmitter<T>['on']>[2]
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
    callback: (e: InferEventTypes<T>) => void
  ): void

  <T extends Target>(
    target: T,
    event: MaybeArray<InferEventNames<T>>,
    opts: NormalizeOptions<InferEventOptions<T>, InferEventTypes<T>>,
    callback: (e: InferEventTypes<T>) => void
  ): void
}

export interface IUseEventGeneric<EventMap, Options = never> {
  <E extends keyof EventMap>(
    target: Emitter,
    event: MaybeArray<E>,
    callback: (e: EventMap[E]) => void
  ): void

  <E extends keyof EventMap>(
    target: Emitter,
    event: MaybeArray<E>,
    opts: NormalizeOptions<Options, EventMap[E]>,
    callback: (e: EventMap[E]) => void
  ): void
}

// ---
type MaybeArray<T> = T | T[]
