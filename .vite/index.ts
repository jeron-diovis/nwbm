import { useChunks } from 'vite-split-config'

import { useBuildLib } from './cfg.build-lib'
import { useLint } from './cfg.lint'
import { useModularImports } from './cfg.modular-imports'
import { useReact } from './cfg.react'
import { useCSS } from './cfg.styles'
import { useTests } from './cfg.tests'

export { useReact, useLint, useModularImports, useCSS, useTests, useBuildLib }

export const defineConfig = useChunks([
  useReact,
  useModularImports,
  useTests,
  useCSS,
])
