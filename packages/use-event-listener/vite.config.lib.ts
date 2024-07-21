import sysPath from 'path'

/**
 * @link https://github.com/egoist/vite-plugin-dts
 */
import dts from 'vite-plugin-dts'
/**
 * @link https://github.com/davidmyersdev/vite-plugin-externalize-deps
 */
import { externalizeDeps } from 'vite-plugin-externalize-deps'
/**
 * @link https://www.npmjs.com/package/vite-plugin-lib-inject-css
 */
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import { defineConfig } from './vite.config'

export default defineConfig({
  build: {
    lib: {
      entry: sysPath.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    minify: false,
    sourcemap: true,
    copyPublicDir: false,
  },

  plugins: [
    externalizeDeps({
      except: [
        /**/
      ],
    }),

    dts({
      exclude: ['**/*.{test,spec}.{ts,tsx}'],
      insertTypesEntry: true,
      // rollupTypes: true, // merge all declarations into a single file
    }),

    libInjectCss(),
  ],
})
