import { useRef, useState } from 'react'

import { useDomEvent } from '../src'

function App() {
  const [count, setCount] = useState(0)
  const [enabled, setEnabled] = useState(true)

  const refBtnCounter = useRef(null)

  useDomEvent(
    'window',
    { click: e => console.log('Click on window', e.target) },
    {
      passive: true,
      enabled,
    }
  )

  useDomEvent(
    refBtnCounter,
    'click',
    () => console.log('Click on counter. Value from closure:', count),
    { enabled }
  )

  return (
    <>
      <div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
            Enable listener hook
          </label>
        </div>

        <button
          ref={refBtnCounter}
          onClick={() => setCount(count => count + 1)}
        >
          count is {count}
        </button>
      </div>
      <p className="read_the_docs">Click around and check console</p>
    </>
  )
}

export default App
