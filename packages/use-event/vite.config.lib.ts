import { useBuildLib } from './.vite-root'
import { defineConfig as defineBaseConfig } from './vite.config'

const defineConfig = defineBaseConfig.extend([
  useBuildLib({
    entry: 'src/index.ts',
    dts: {
      rollupTypes: true,
    },
  }),
])

export default defineConfig({})
