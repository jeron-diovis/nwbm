import { useState } from 'react'

import { useOnChange } from '../src'

import './App.css'

function App() {
  const [value, setValue] = useState(1)
  const [factor, setFactor] = useState(1)
  const [result, setResult] = useState(value * factor)

  useOnChange(value, value => {
    setResult(value * factor)
  })

  return (
    <>
      <div className="card">
        <div>Result: {result}</div>
        <label>
          Value:
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.valueAsNumber)}
          />
        </label>
        <br />

        <label>
          Factor:
          <input
            type="number"
            value={factor}
            onChange={e => setFactor(e.target.valueAsNumber)}
          />
        </label>
      </div>
    </>
  )
}

export default App
