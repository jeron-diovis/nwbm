import { useEvent } from './useEvent'
import { Fn, ICreateUseEvent } from './useEvent.types'

export const createUseEvent = (useTarget =>
  useTarget
    ? (...args: any[]) => (useEvent as Fn)(useTarget(), ...args)
    : useEvent) as ICreateUseEvent
