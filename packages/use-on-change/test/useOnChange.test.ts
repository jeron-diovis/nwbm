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

  it('should allow to run on mount immediately', () => {
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
})
