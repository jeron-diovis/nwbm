import { EventEmitter } from 'node:events'

import { renderHook } from '@testing-library/react'

import { createUseEvent, useEvent } from '../src'

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
    renderHook(() => useEvent(emitter, 'click', { enabled: false }, cb))
    emitter.emit('click')
    expect(cb).not.toHaveBeenCalled()
  })

  it('should not call event handler when "filter" option returns false', () => {
    const cb = vi.fn()
    const emitter = new EventEmitter()
    renderHook(() => useEvent(emitter, 'test', { filter: e => e.foo }, cb))
    emitter.emit('test', { foo: true })
    emitter.emit('test', { foo: false })
    expect(cb).toHaveBeenCalledTimes(1)
  })
})

describe('createUseEvent', () => {
  it('should create a typed useEvent hook', () => {
    type MyEvent = {
      foo: boolean
    }
    type EventsMap = {
      custom: (e: MyEvent) => void
    }
    type MyListenerOptions = {
      myOption?: number
    }
    const useEvent = createUseEvent<EventsMap, MyListenerOptions>()
    expect(typeof useEvent).toBe('function')

    const cb = vi.fn()
    const emitter = new EventEmitter()
    /* Note all the type inference here.
     * TODO: how to test inference working? */
    renderHook(() =>
      useEvent(emitter, 'custom', { filter: e => e.foo, myOption: 1 }, e =>
        cb(e.foo)
      )
    )
    emitter.emit('custom', { foo: true })
    expect(cb).toHaveBeenCalled()
  })
})
