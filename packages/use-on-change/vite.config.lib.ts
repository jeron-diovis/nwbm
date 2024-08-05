import { useBuildLib } from './.vite-root'
import { defineConfig as defineBaseConfig } from './vite.config'

const defineConfig = defineBaseConfig.extend([
  useBuildLib({
    entry: 'src/index.ts',
  }),
])

export default defineConfig({})
