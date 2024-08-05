import { renderHook } from '@testing-library/react'

import { useChanges } from '../src'

describe('useChanges', () => {
  it('should return current and previous values, and flag whether they are different, using shallow comparison by default', () => {
    const value1 = { a: 1 }
    const value2 = { a: 1 }
    const value3 = { a: 2 }

    const { result, rerender } = renderHook(({ value }) => useChanges(value), {
      initialProps: { value: value1 },
    })

    expect(result.current.value).toBe(value1)
    expect(result.current.prev).toBe(value1)
    expect(result.current.changed).toBe(false)

    rerender({ value: value2 })

    expect(result.current.value).toBe(value2)
    expect(result.current.prev).toBe(value1)
    expect(result.current.changed).toBe(false)

    rerender({ value: value3 })

    expect(result.current.value).toBe(value3)
    expect(result.current.prev).toBe(value1)
    expect(result.current.changed).toBe(true)
  })
})
