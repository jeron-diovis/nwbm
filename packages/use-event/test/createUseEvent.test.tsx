import { EventEmitter } from 'node:events'

import { createContext, useContext } from 'react'

import { fireEvent, render, renderHook } from '@testing-library/react'

import { createUseEvent } from '../src'

describe('createUseEvent', () => {
  type MyEvent = { foo: boolean }
  type MyEventsMap = { custom: [MyEvent] }
  type MyListenerOptions = { myOption?: number }

  /* TODO: how to actually _test_ that inference is working properly?
   *  (aside of failing tscheck on precommit) */
  it('should define a custom-typed "useEvent" hook', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter<MyEventsMap>()

    const useMyEvent = createUseEvent<MyEventsMap, MyListenerOptions>()

    /* Note all the type inference on params and options here. */
    renderHook(() =>
      useMyEvent(emitter, 'custom', e => cb(e.foo), {
        filter: e => e.foo,
        myOption: 1,
      })
    )

    emitter.emit('custom', { foo: true })
    expect(cb).toHaveBeenCalled()
  })

  it('should create hook version without "target" param', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter<MyEventsMap>()

    const useEmitterEvent = createUseEvent<MyEventsMap, MyListenerOptions>(
      () => emitter
    )

    renderHook(() =>
      useEmitterEvent('custom', e => cb(e.foo), {
        filter: e => e.foo,
        myOption: 1,
      })
    )

    emitter.emit('custom', { foo: true })
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
      useEmitterEvent('custom', e => cb(e.foo), {
        filter: e => e.foo,
        myOption: 1,
      })
      return null
    }

    render(
      <Context.Provider value={emitter}>
        <Component />
      </Context.Provider>
    )

    emitter.emit('custom', { foo: true })
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
