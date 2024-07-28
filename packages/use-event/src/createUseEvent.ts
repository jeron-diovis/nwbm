import { useEvent } from './useEvent'
import { Fn, ICreateUseEvent } from './useEvent.types'

export const createUseEvent: ICreateUseEvent = (...args: any[]) => {
  const [useTarget] = args
  return useTarget
    ? (...args: any[]) => (useEvent as Fn)(useTarget(), ...args)
    : useEvent
}
