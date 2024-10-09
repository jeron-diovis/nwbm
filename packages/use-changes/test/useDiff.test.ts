import { renderHook } from '@testing-library/react'

import { useDiff } from '../src'

describe('useDiff', () => {
  it('should map next and prev value to new one', () => {
    const value1 = 2
    const value2 = 6

    const { result, rerender } = renderHook(
      ({ value }) => useDiff(value, (next, prev) => (next / prev).toString()),
      {
        initialProps: { value: value1 },
      }
    )

    expect(result.current).toBe('1')
    rerender({ value: value2 })
    expect(result.current).toBe('3')
  })

  it('should only invoke mapper initially and when value changes', () => {
    type Value = { x: number }
    const value1: Value = { x: 2 }
    const value2: Value = { x: 2 }
    const value3: Value = { x: 6 }

    const mapper = vitest.fn((next: Value, prev: Value) =>
      (next.x / prev.x).toString()
    )

    const { rerender } = renderHook(({ value }) => useDiff(value, mapper), {
      initialProps: { value: value1 },
    })

    expect(mapper).toHaveBeenCalledTimes(1)
    expect(mapper).toHaveBeenCalledWith(value1, value1, true)

    rerender({ value: value2 })
    expect(mapper).toHaveBeenCalledTimes(1)

    rerender({ value: value3 })
    expect(mapper).toHaveBeenCalledTimes(2)
    expect(mapper).toHaveBeenCalledWith(value3, value1, false)
  })
})
