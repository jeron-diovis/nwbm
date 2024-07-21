import { RefObject, createRef } from 'react'

import { fireEvent, render, renderHook } from '@testing-library/react'

import { UseEventListenerOptions, useEventListener } from '../src'

function Demo(props: {
  eventName: string | string[]
  elRef: RefObject<any>
  handler: (event: Event) => void
  opts?: UseEventListenerOptions
}) {
  const { eventName, elRef, handler, opts = {} } = props
  useEventListener(elRef, eventName as any, opts, handler)
  return (
    <div ref={elRef} data-testid="test-element">
      Test
    </div>
  )
}

describe('useEventListener', () => {
  it('should call event handler when event occurs', () => {
    const cb = vi.fn()
    const ref = createRef()
    const { getByTestId } = render(
      <Demo eventName="click" elRef={ref} handler={cb} />
    )

    const testElement = getByTestId('test-element')
    fireEvent.click(testElement)

    expect(cb).toHaveBeenCalled()
  })

  it('should not call event handler when "enabled" option is false', () => {
    const cb = vi.fn()
    const ref = createRef()
    const { getByTestId } = render(
      <Demo
        eventName="click"
        elRef={ref}
        handler={cb}
        opts={{ enabled: false }}
      />
    )

    const testElement = getByTestId('test-element')
    fireEvent.click(testElement)

    expect(cb).not.toHaveBeenCalled()
  })

  it('should accept event listener options', () => {
    const cb = vi.fn()
    const ref = createRef()
    const { getByTestId } = render(
      <Demo eventName="click" elRef={ref} handler={cb} opts={{ once: true }} />
    )

    const testElement = getByTestId('test-element')
    fireEvent.click(testElement)
    fireEvent.click(testElement)

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should subscribe to multiple events', () => {
    const cb = vi.fn()
    const ref = createRef()
    const { getByTestId } = render(
      <Demo eventName={['click', 'mouseover']} elRef={ref} handler={cb} />
    )

    const testElement = getByTestId('test-element')
    fireEvent.click(testElement)
    fireEvent.mouseOver(testElement)

    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should add listener to window', () => {
    const cb = vi.fn()

    renderHook(() => useEventListener('window', 'click', cb))
    fireEvent.click(window)

    expect(cb).toHaveBeenCalled()
  })

  it('should add listener to document', () => {
    const cb = vi.fn()

    renderHook(() => useEventListener('document', 'click', cb))
    fireEvent.click(document)

    expect(cb).toHaveBeenCalled()
  })

  it('should not execute listener if "filter" option returns false', () => {
    const cb = vi.fn()

    renderHook(() =>
      useEventListener(
        'document',
        'keypress',
        { filter: e => e.key === 'a' },
        cb
      )
    )
    fireEvent.keyPress(document, { key: 'a' })
    fireEvent.keyPress(document, { key: 'b' })

    expect(cb).toHaveBeenCalledTimes(1)
  })
})
