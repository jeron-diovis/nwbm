import { EventEmitter } from 'node:events'

import { useRef } from 'react'

import { renderHook } from '@testing-library/react'

import { IUseEvent, useEvent } from '../src'

describe('useEvent', () => {
  describe('subscription interface', () => {
    it('on / off', () => {
      const cb = vi.fn()
      const emitter = new EventEmitter()
      renderHook(() => useEvent(emitter, 'click', cb))
      emitter.emit('click')
      expect(cb).toHaveBeenCalled()
    })

    it('addEventListener / removeEventListener', () => {
      const cb = vi.fn()
      const emitter = new EventEmitter()
      const proxy = {
        addEventListener: emitter.on.bind(emitter),
        removeEventListener: emitter.off.bind(emitter),
      }
      renderHook(() => useEvent(proxy, 'click', cb))
      emitter.emit('click')
      expect(cb).toHaveBeenCalled()
    })

    it('addListener / removeListener', () => {
      const cb = vi.fn()
      const emitter = new EventEmitter()
      const proxy = {
        addListener: emitter.on.bind(emitter),
        removeListener: emitter.off.bind(emitter),
      }
      renderHook(() => useEvent(proxy, 'click', cb))
      emitter.emit('click')
      expect(cb).toHaveBeenCalled()
    })

    it('should support refs', () => {
      const cb = vi.fn()
      const emitter = new EventEmitter()
      renderHook(() => {
        const ref = useRef(emitter)
        useEvent(ref, 'click', cb)
      })
      emitter.emit('click')
      expect(cb).toHaveBeenCalled()
    })
  })

  it('should subscribe to multiple events', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter()
    renderHook(() => useEvent(emitter, ['first', 'second'], cb))
    emitter.emit('first')
    emitter.emit('second')
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should not call event handler when "enabled" option is false', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter()
    renderHook(() => useEvent(emitter, 'click', cb, { enabled: false }))
    emitter.emit('click')
    expect(cb).not.toHaveBeenCalled()
  })

  it('should not call event handler when "filter" option returns false', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter()
    renderHook(() =>
      useEvent(emitter, 'test', e => cb(e.foo), { filter: e => e.foo })
    )
    emitter.emit('test', { foo: true })
    emitter.emit('test', { foo: false })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  /* TODO: how to actually _test_ that inference is working properly?
   *  (aside of failing tscheck on precommit) */
  it('should define a custom-typed useEvent hook', () => {
    type MyEvent = {
      foo: boolean
    }
    type EventsMap = {
      custom: (e: MyEvent) => void
    }
    type MyListenerOptions = {
      myOption?: number
    }

    const useMyEvent: IUseEvent<EventsMap, MyListenerOptions> = useEvent

    const cb = vi.fn()
    const emitter = new EventEmitter()
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
})
