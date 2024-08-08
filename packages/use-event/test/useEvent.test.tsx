import { EventEmitter } from 'node:events'

import { useRef } from 'react'

import { fireEvent, renderHook } from '@testing-library/react'

import { useEvent } from '../src'

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
      renderHook(() => useEvent(window, 'click', cb))
      fireEvent.click(window)
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

  describe('subscribe to multiple events', () => {
    it('array notation', () => {
      const cb = vi.fn()
      const emitter = new EventEmitter()
      renderHook(() => useEvent(emitter, ['first', 'second'], cb))
      emitter.emit('first')
      emitter.emit('second')
      expect(cb).toHaveBeenCalledTimes(2)
    })

    it('object notation', () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()
      const emitter = new EventEmitter()
      renderHook(() => useEvent(emitter, { first: cb1, second: cb2 }))
      emitter.emit('first')
      emitter.emit('second')
      expect(cb1).toHaveBeenCalledTimes(1)
      expect(cb2).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call event handler when options.enabled=false', () => {
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

  describe('object notation', () => {
    it('options.enabled=false should disable all listeners at once', () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()
      const emitter = new EventEmitter()
      renderHook(() =>
        useEvent(emitter, { first: cb1, second: cb2 }, { enabled: false })
      )
      emitter.emit('first')
      emitter.emit('second')
      expect(cb1).not.toHaveBeenCalled()
      expect(cb2).not.toHaveBeenCalled()
    })

    it('should pass listener options to all listeners at once', () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()

      renderHook(() =>
        useEvent(window, { click: cb1, focus: cb2 }, { once: true })
      )

      fireEvent.click(window)
      fireEvent.focus(window)

      fireEvent.click(window)
      fireEvent.focus(window)

      expect(cb1).toHaveBeenCalledTimes(1)
      expect(cb2).toHaveBeenCalledTimes(1)
    })

    it('should handle explicitly undefined listeners', () => {
      const emitter = new EventEmitter()

      const scenario = () => {
        renderHook(() => useEvent(emitter, { test: undefined }))
        emitter.emit('test')
      }

      expect(scenario).not.toThrow()
    })

    it('should always call the latest listener', () => {
      const cb = vi.fn()
      type EventMap = { test: [{ value: number }] }
      const emitter = new EventEmitter<EventMap>()

      const { rerender } = renderHook(
        ({ factor }) => {
          useEvent(emitter, 'test', e => cb(e.value * factor))
        },
        {
          initialProps: { factor: 1 },
        }
      )

      emitter.emit('test', { value: 1 })
      expect(cb).toHaveBeenCalledWith(1)
      rerender({ factor: 2 })
      emitter.emit('test', { value: 2 })
      expect(cb).toHaveBeenCalledWith(4)
    })
  })
})
