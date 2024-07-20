import { useChunks } from 'vite-split-config'

import { useBuildAnalysis } from './cfg.build-analysis'
import { useLint } from './cfg.lint'
import { useModularImports } from './cfg.modular-imports'
import { useReact } from './cfg.react'
import { useCSS } from './cfg.styles'
import { useTests } from './cfg.tests'

export {
  useReact,
  useLint,
  useModularImports,
  useCSS,
  useTests,
  useBuildAnalysis,
}

export const defineConfig = useChunks([
  useReact,
  useModularImports,
  useTests,
  useBuildAnalysis,
  useCSS,
])
