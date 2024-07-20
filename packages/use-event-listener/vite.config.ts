import sysPath from 'path'

import { defineConfig as defineBaseConfig, useLint } from './.vite-root'
import pkg from './package.json'

const defineConfig = defineBaseConfig.extend([
  useLint({
    eslint: pkg.scripts['lint:js'],
    stylelint: pkg.scripts['lint:css'],
  }),
])

export default defineConfig({
  resolve: {
    alias: {
      src: sysPath.resolve(__dirname, 'src'),
    },
  },
})
