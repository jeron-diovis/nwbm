import { EventEmitter } from 'node:events'

import { createContext, useContext } from 'react'

import { fireEvent, render, renderHook } from '@testing-library/react'

import { createUseEvent } from '../src'

describe('createUseEvent', () => {
  type MyEvent1 = { arg_1: boolean; common?: boolean }
  type MyEvent2 = { arg_2: boolean; common?: boolean }
  type MyEventsMap = { e1: [MyEvent1]; e2: [MyEvent2] }
  type MyListenerOptions = { myOption?: number }

  /* TODO: how to actually _test_ that inference is working properly?
   *  (aside of failing tscheck on precommit) */
  it('should define a custom-typed "useEvent" hook', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter<MyEventsMap>()

    const useMyEvent = createUseEvent<MyEventsMap, MyListenerOptions>()

    /* Note all the type inference on params and options here. */
    renderHook(() =>
      useMyEvent(emitter, 'e1', e => cb(e.common), {
        filter: e => e.common !== false,
        myOption: 1,
      })
    )

    emitter.emit('e1', { arg_1: true })
    expect(cb).toHaveBeenCalled()
  })

  it('should create hook version without "target" param', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter<MyEventsMap>()

    const useEmitterEvent = createUseEvent<MyEventsMap, MyListenerOptions>(
      () => emitter
    )

    renderHook(() =>
      useEmitterEvent(['e1', 'e2'], e => cb(e.common), {
        filter: e => e.common !== false,
        myOption: 1,
      })
    )

    emitter.emit('e1', { arg_1: true })
    expect(cb).toHaveBeenCalled()
  })

  it('should take "target" value from react context', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter<MyEventsMap>()

    const Context = createContext<typeof emitter | null>(null)

    const useEmitterEvent = createUseEvent<MyEventsMap, MyListenerOptions>(() =>
      useContext(Context)
    )

    const Component = () => {
      useEmitterEvent(
        {
          e1: e => cb(e.arg_1),
        },
        {
          filter: e => e.arg_1,
          myOption: 1,
        }
      )
      return null
    }

    render(
      <Context.Provider value={emitter}>
        <Component />
      </Context.Provider>
    )

    emitter.emit('e1', { arg_1: true })
    expect(cb).toHaveBeenCalled()
  })

  it('Example of "useWindowEvent"', () => {
    const cb = vi.fn()

    const useWindowEvent = createUseEvent<
      WindowEventMap,
      AddEventListenerOptions
    >(() => window)

    /* Note all the type inference on params and options here. */
    renderHook(() =>
      useWindowEvent(
        {
          keypress: e => cb(e.shiftKey),
          click: e => cb(e.button),
          // foo: e => cb(e.foo),
          // bar: 42,
        },
        {
          once: true,
          filter: e => !e.defaultPrevented,
        }
      )
    )

    fireEvent.keyPress(window, { key: 'a' })
    fireEvent.keyPress(window, { key: 'b' })
    fireEvent.click(window)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
