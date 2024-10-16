import { useEffect, useState } from 'react'

import { useChanges, useDiff, useOnChange } from '../src'

import './App.css'

function App() {
  const [value, setValue] = useState(1)
  const [factor, setFactor] = useState(1)
  const [result, setResult] = useState(value * factor)

  /* completely artificial example just to demonstrate that changes are tracked */
  useOnChange(value, value => {
    setResult(value * factor)
  })

  return (
    <div className="app">
      <div className="card form">
        <label className="control">
          Value:
          <div>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.valueAsNumber)}
            />
            <div className="hint">changing this will update UI</div>
          </div>
        </label>

        <label className="control">
          Factor:
          <div>
            <input
              type="number"
              value={factor}
              onChange={e => setFactor(e.target.valueAsNumber)}
            />
            <div className="hint">changing this will NOT update UI</div>
          </div>
        </label>

        <div className="control">
          Result: <span>{result}</span>
        </div>
      </div>

      <DemoMeta value={result} />
      <DemoDiff value={result} />
    </div>
  )
}

function DemoMeta({ value }: { value: number }) {
  const meta = useChanges(value)
  const [log, setLog] = useState<Array<typeof meta>>([])

  useEffect(() => {
    if (meta.changed) {
      setLog(log => [...log, meta])
    }
  }, [meta])

  return (
    <div className="card">
      <div>Meta:</div>
      <ul>
        {log.map(x => (
          <li key={x.value}>{JSON.stringify(x, null, 2)}</li>
        ))}
      </ul>
    </div>
  )
}

function DemoDiff({ value }: { value: number }) {
  const diff = useDiff(value, (next, prev) => ({ next, prev }))
  return (
    <div className="card">
      <div>Diff: (next - prev)</div>
      <div>{`${diff.next} - ${diff.prev} = ${diff.next - diff.prev}`}</div>
    </div>
  )
}

export default App
