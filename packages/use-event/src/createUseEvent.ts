// import { useEvent } from './useEvent'
import { ICreateUseEvent } from './useEvent.types'
import { useEvent as useEvent } from './useEvent2'

export const createUseEvent = (useTarget =>
  useTarget
    ? (...args) => (useEvent as any)(useTarget(), ...args)
    : useEvent) as ICreateUseEvent
