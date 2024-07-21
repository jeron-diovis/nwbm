import { RefObject, useEffect, useRef } from 'react'

type FnSub = (
  type: unknown,
  listener: (...args: any[]) => void,
  options?: boolean | EventListenerOptions
) => void

type FnUnSub = (
  type: unknown,
  listener: (...args: any[]) => void,
  options?: boolean | EventListenerOptions
) => void

type Target1 = {
  on: FnSub
  off: FnUnSub
}

type Target2 = {
  addEventListener: FnSub
  removeEventListener: FnUnSub
}

type Target3 = {
  addListener: FnSub
  removeListener: FnUnSub
}

type Target = Target2 | Target1 | Target3

export type UseEventOptions<FilterArg = unknown> = {
  enabled?: boolean
  filter?: (e: FilterArg) => boolean
}

type NormalizeOptions<T, Filter> = Omit<T, keyof UseEventOptions> &
  UseEventOptions<Filter>

type ExtractTarget<T> = T extends RefObject<infer U> ? U : T

type _NormalizedTarget<T> = T extends Target1
  ? T
  : T extends Target2
    ? { on: T['addEventListener']; off: T['removeEventListener'] }
    : T extends Target3
      ? { on: T['addListener']; off: T['removeListener'] }
      : never

type NormalizedTarget<T> = _NormalizedTarget<ExtractTarget<T>>

type InferEventNames<T> = Parameters<NormalizedTarget<T>['on']>[0]

type InferEventTypes<T> = Parameters<
  Parameters<NormalizedTarget<T>['on']>[1]
>[0]

type InferEventOptions<T> = Parameters<NormalizedTarget<T>['on']>[2]

type MaybeArray<T> = T | T[]

export interface IUseEvent<EventMap, Options = never> {
  <E extends keyof EventMap>(
    target: Target,
    event: MaybeArray<E>,
    callback: (e: EventMap[E]) => void
  ): void

  <E extends keyof EventMap>(
    target: Target,
    event: MaybeArray<E>,
    opts: NormalizeOptions<Options, EventMap[E]>,
    callback: (e: EventMap[E]) => void
  ): void
}

export const createUseEvent = <EventMap, Options = never>(): IUseEvent<
  EventMap,
  Options
> => useEvent

type RefOrVal<T> = RefObject<T> | T
type RefOrTarget = RefOrVal<Target>

export function useEvent<T extends RefOrTarget>(
  target: T,
  event: MaybeArray<InferEventNames<T>>,
  callback: (e: InferEventTypes<T>) => void
): void

export function useEvent<T extends RefOrTarget>(
  target: T,
  event: MaybeArray<InferEventNames<T>>,
  opts: NormalizeOptions<InferEventOptions<T>, InferEventTypes<T>>,
  callback: (e: InferEventTypes<T>) => void
): void

export function useEvent<T extends RefOrTarget>(
  target: T,
  event: MaybeArray<InferEventNames<T>>,
  third: unknown,
  fourth?: unknown
) {
  // ---
  // parse overload params
  type Fn = (...args: any[]) => void
  let listener: Fn
  let options: UseEventOptions
  if (typeof third === 'function') {
    listener = third as Fn
    options = {}
  } else {
    options = third as UseEventOptions
    listener = fourth as Fn
  }

  const refListener = useRef(listener)
  refListener.current = listener
  const refOptions = useRef(options)
  refOptions.current = options

  const refIsActive = useRef(true)

  useEffect(
    () => {
      if (!target) return undefined

      const el = 'current' in target ? target.current : (target as Target)
      if (!el) return undefined

      const { enabled, ...listenerOptions } = refOptions.current ?? {}
      if (enabled === false) return undefined

      refIsActive.current = true

      const listener = (...args: any[]) => {
        if (!refIsActive.current) return
        if (refOptions.current.filter?.(args[0]) === false) return
        refListener.current(...args)
      }

      const events = Array.isArray(event) ? event : [event]

      events.forEach(event => {
        sub(el, event, listener, listenerOptions)
      })

      return () => {
        refIsActive.current = false

        events.forEach(event => {
          unsub(el, event, listener, listenerOptions)
        })
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      target,
      Array.isArray(event) ? event.join(' ') : event,
      refOptions.current.enabled,
    ]
    /* eslint-enable */
  )
}

type Fn = (...args: any[]) => void

function sub(target: Target, ...args: any[]) {
  if ('on' in target) {
    return (target.on as Fn)(...args)
  }

  if ('addEventListener' in target) {
    return (target.addEventListener as Fn)(...args)
  }

  if ('addListener' in target) {
    return (target.addListener as Fn)(...args)
  }

  throw new Error('Invalid subscription interface')
}

function unsub(target: Target, ...args: any[]) {
  if ('off' in target) {
    return (target.off as Fn)(...args)
  }

  if ('removeEventListener' in target) {
    return (target.removeEventListener as Fn)(...args)
  }

  if ('removeListener' in target) {
    return (target.removeListener as Fn)(...args)
  }

  throw new Error('Invalid subscription interface')
}
