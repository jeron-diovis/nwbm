import { useEvent } from './useEvent'
import { ICreateUseEvent } from './useEvent.types'

export const createUseEvent = (useTarget =>
  useTarget
    ? (...args) => useEvent(useTarget(), ...args)
    : useEvent) as ICreateUseEvent
