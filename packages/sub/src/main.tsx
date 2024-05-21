import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// example import via tsconfig.paths
import Example1 from "@core/App.tsx"

// example import via workspace (dependency in package.json),
// in conjunction with "exports" in package.json
import Example2 from "@scope/core/App.tsx"

console.log(Example1, Example2)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
