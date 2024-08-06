import { renderHook } from '@testing-library/react'

import { useChanged } from '../src'

describe('useChanged', () => {
  it('should return previous value if value did not change, using shallow equality by default', () => {
    const value = { a: 1 }

    const { result, rerender } = renderHook(({ value }) => useChanged(value), {
      initialProps: { value },
    })
    expect(result.current).toBe(value)
    rerender({ value: { a: 1 } })
    expect(result.current).toBe(value)
  })

  it('should return new value if value changed', () => {
    const value1 = { a: 1 }
    const value2 = { a: 2 }

    const { result, rerender } = renderHook(({ value }) => useChanged(value), {
      initialProps: { value: value1 },
    })
    expect(result.current).toBe(value1)
    rerender({ value: value2 })
    expect(result.current).toBe(value2)
  })

  describe('options', () => {
    describe('eq', () => {
      it('deepEqual', () => {
        const value1 = [1, [2]]
        const value2 = [1, [3]]

        const { result, rerender } = renderHook(
          ({ value }) => useChanged(value, { eq: 'deep' }),
          {
            initialProps: { value: value1 },
          }
        )
        expect(result.current).toBe(value1)
        rerender({ value: [1, [2]] })
        expect(result.current).toBe(value1)
        rerender({ value: value2 })
        expect(result.current).toBe(value2)
      })

      it('custom', () => {
        const value1 = [1, 2]
        const value2 = [3, 4]

        const { result, rerender } = renderHook(
          ({ value }) =>
            useChanged(value, { eq: (a, b) => a.length === b.length }),
          {
            initialProps: { value: value1 },
          }
        )
        expect(result.current).toBe(value1)
        rerender({ value: value2 })
        expect(result.current).toBe(value1)
      })
    })

    it('by', () => {
      const value1 = { a: [1, 2, 3] }
      const value2 = { a: [3, 1, 2] }

      const { result, rerender } = renderHook(
        ({ value }) =>
          useChanged(value, {
            by: x => [...x.a].sort(),
          }),
        {
          initialProps: { value: value1 },
        }
      )
      expect(result.current).toBe(value1)
      rerender({ value: value2 })
      expect(result.current).toBe(value1)
    })
  })
})
