import { RefObject, createRef } from 'react'

import { fireEvent, render, renderHook } from '@testing-library/react'

import { UseDomEventOptions, useDomEvent } from '../src'

function Demo(props: {
  eventName: string | string[]
  elRef: RefObject<any>
  handler: (event: Event) => void
  opts?: UseDomEventOptions
}) {
  const { eventName, elRef, handler, opts = {} } = props
  useDomEvent(elRef, eventName as any, handler, opts)
  return (
    <div ref={elRef} data-testid="test">
      Test
    </div>
  )
}

describe('useDomEvent', () => {
  it('should call event handler when event occurs', () => {
    const cb = vi.fn()
    const ref = createRef()
    const { getByTestId } = render(
      <Demo eventName="click" elRef={ref} handler={cb} />
    )

    const el = getByTestId('test')
    fireEvent.click(el)

    expect(cb).toHaveBeenCalled()
  })

  it('should accept event listener options', () => {
    const cb = vi.fn()
    const ref = createRef()
    const { getByTestId } = render(
      <Demo eventName="click" elRef={ref} handler={cb} opts={{ once: true }} />
    )

    const el = getByTestId('test')
    fireEvent.click(el)
    fireEvent.click(el)

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should add listener to window', () => {
    const cb = vi.fn()

    renderHook(() => useDomEvent('window', 'click', cb))
    fireEvent.click(window)

    expect(cb).toHaveBeenCalled()
  })

  it('should add listener to document', () => {
    const cb = vi.fn()

    renderHook(() => useDomEvent('document', 'click', cb))
    fireEvent.click(document)

    expect(cb).toHaveBeenCalled()
  })

  it('should not execute listener if "filter" option returns false', () => {
    const cb = vi.fn()

    renderHook(() =>
      useDomEvent('document', 'keypress', cb, { filter: e => e.key === 'a' })
    )
    fireEvent.keyPress(document, { key: 'a' })
    fireEvent.keyPress(document, { key: 'b' })

    expect(cb).toHaveBeenCalledTimes(1)
  })
})
