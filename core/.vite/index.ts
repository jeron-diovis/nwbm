import { useChunks } from 'vite-split-config'

import { useBuildAnalysis } from './cfg.build-analysis'
import { useChunkSplit } from './cfg.chunk-split'
import { useJsonServer } from './cfg.json-server'
import { useLint } from './cfg.lint'
import { useModularImports } from './cfg.modular-imports'
import { useNodeCompat } from './cfg.node-compat'
import { useProxy } from './cfg.proxy'
import { useReact } from './cfg.react'
import { useCSS } from './cfg.styles'
import { useTests } from './cfg.tests'

export {
  useReact,
  useCSS,
  useLint,
  useModularImports,
  useNodeCompat,
  useJsonServer,
  useChunkSplit,
  useProxy,
  useTests,
  useBuildAnalysis,
}

export const defineConfig = useChunks([
  useReact,
  useCSS,
  useLint,
  useModularImports,
  // useNodeCompat,
  useJsonServer,
  useChunkSplit,
  useProxy,
  useTests,
  useBuildAnalysis,
])
