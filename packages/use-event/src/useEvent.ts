// import { IUseEvent } from './useEvent.types'
// import { useEvent as useEvent2 } from './useEvent2'

// type Fn = (...args: any[]) => void

export { useEvent } from './useEvent2'
/*
export const useEvent: IUseEvent = (target, event, listener, options) => {
  // const eventsMap = useMemo(
  //   () =>
  //     Array.isArray(event)
  //       ? event.reduce(
  //           (m, e) => ({
  //             ...m,
  //             [e]: (...args: any[]) => refListener.current(...args),
  //           }),
  //           {} as Record<string, Fn>
  //         )
  //       : { [event]: (...args: any[]) => refListener.current(...args) },
  //   [Array.isArray(event) ? event.join(' ') : event]
  // )

  /!*const eventsMap = Array.isArray(event)
    ? event.reduce((m, e) => ({ ...m, [e]: listener }), {})
    : { [event]: listener }
  return useEvent2(target, eventsMap, options)*!/
  return useEvent2(target, event, listener, options)
}
*/
