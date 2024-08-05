import { useState } from 'react'

import { act, renderHook } from '@testing-library/react'

import { useOnChange } from '../src'

describe('useOnChange', () => {
  describe('primitive values', () => {
    it('should call callback with actual and prev values, when value changes', () => {
      const cb = vi.fn()

      const { result } = renderHook(() => {
        const [value, setValue] = useState('off')
        useOnChange(value, cb)
        return [value, setValue] as const
      })

      expect(result.current[0]).toBe('off')
      expect(cb).not.toHaveBeenCalled()

      act(() => result.current[1]('on'))

      expect(result.current[0]).toBe('on')
      expect(cb).toHaveBeenCalledWith('on', 'off')
    })

    it('should not call callback when value does not change', () => {
      const cb = vi.fn()

      const { rerender } = renderHook(({ value }) => useOnChange(value, cb), {
        initialProps: { value: 'off' },
      })

      expect(cb).not.toHaveBeenCalled()
      rerender({ value: 'off' })
      expect(cb).not.toHaveBeenCalled()
      rerender({ value: 'on' })
      expect(cb).toHaveBeenCalledWith('on', 'off')
    })
  })

  describe('shallow-equal', () => {
    it('should support shallow-equal comparison for object out of the box', () => {
      const cb = vi.fn()

      const { rerender } = renderHook(({ value }) => useOnChange(value, cb), {
        initialProps: { value: [1, 2] },
      })

      expect(cb).not.toHaveBeenCalled()
      rerender({ value: [1, 2] })
      expect(cb).not.toHaveBeenCalled()
      rerender({ value: [1, 3] })
      expect(cb).toHaveBeenCalledWith([1, 3], [1, 2])
    })
  })

  describe('options', () => {
    it('runOnMount', () => {
      const cb = vi.fn()

      renderHook(
        ({ value }) =>
          useOnChange(value, cb, {
            runOnMount: true,
          }),
        {
          initialProps: { value: 42 },
        }
      )

      expect(cb).toHaveBeenCalledWith(42, 42)
    })

    describe('eq', () => {
      it('should support custom comparator', () => {
        const cb = vi.fn()

        const { rerender } = renderHook(
          ({ value }) =>
            useOnChange(value, cb, {
              eq: (a, b) => a.length === b.length,
            }),
          {
            initialProps: { value: 'a' },
          }
        )

        expect(cb).not.toHaveBeenCalled()
        rerender({ value: 'b' })
        expect(cb).not.toHaveBeenCalled()
        rerender({ value: 'cc' })
        expect(cb).toHaveBeenCalledWith('cc', 'a')
      })

      it('should use SameValueZero comparator', () => {
        const cb = vi.fn()

        const { rerender } = renderHook(
          ({ value }) =>
            useOnChange(value, cb, {
              eq: 'plain',
            }),
          {
            initialProps: { value: [1, 2] as any },
          }
        )

        rerender({ value: [1, 2] })
        expect(cb).toHaveBeenCalledWith([1, 2], [1, 2])

        rerender({ value: 1 })
        rerender({ value: 2 })
        expect(cb).toHaveBeenCalledWith(2, 1)
      })

      it('should use shallowEqual comparator', () => {
        const cb = vi.fn()

        const { rerender } = renderHook(
          ({ value }) =>
            useOnChange(value, cb, {
              eq: 'shallow',
            }),
          {
            initialProps: { value: [1, 2] as any },
          }
        )

        rerender({ value: [1, 2] })
        expect(cb).not.toHaveBeenCalled()
        rerender({ value: [1, 3] })
        expect(cb).toHaveBeenCalledWith([1, 3], [1, 2])

        rerender({ value: [1, [2]] })
        rerender({ value: [1, [2]] })
        expect(cb).toHaveBeenCalledWith([1, [2]], [1, [2]])
      })

      it('should use deepEqual comparator', () => {
        const cb = vi.fn()

        const { rerender } = renderHook(
          ({ value }) =>
            useOnChange(value, cb, {
              eq: 'deep',
            }),
          {
            initialProps: { value: [1, [2]] as any },
          }
        )

        rerender({ value: [1, [2]] })
        expect(cb).not.toHaveBeenCalled()
        rerender({ value: [1, [3]] })
        expect(cb).toHaveBeenCalledWith([1, [3]], [1, [2]])
      })
    })

    it('enabled: should skip comparator when set to false', () => {
      const cb = vi.fn()
      const comparator = vi.fn((a, b) => a === b)

      const { rerender } = renderHook(
        ({ value, enabled }) =>
          useOnChange(value, cb, {
            enabled,
            eq: comparator,
          }),
        {
          initialProps: { value: 'a', enabled: false },
        }
      )

      rerender({ value: 'b', enabled: false })
      expect(cb).not.toHaveBeenCalled()
      expect(comparator).not.toHaveBeenCalled()
      rerender({ value: 'b', enabled: true })
      expect(cb).toHaveBeenCalledWith('b', 'a')
    })

    it('filter: should skip callback invocation when returns false', () => {
      const cb = vi.fn()
      const filter = vi.fn((next, prev) => next / prev === 2)

      const { rerender } = renderHook(
        ({ value }) =>
          useOnChange(value, cb, {
            filter,
          }),
        {
          initialProps: { value: 1 },
        }
      )

      rerender({ value: 3 })
      expect(filter).toHaveBeenCalledWith(3, 1)
      expect(cb).not.toHaveBeenCalled()

      rerender({ value: 6 })
      expect(filter).toHaveBeenCalledWith(6, 3)
      expect(cb).toHaveBeenCalledWith(6, 3)
    })
  })
})
