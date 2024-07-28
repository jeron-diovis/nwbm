// @ts-expect-error rollup-plugin-terser some irrelevant typings issues in this pkg
import { terser } from 'rollup-plugin-terser'
import { LibraryOptions } from 'vite'
/**
 * @link https://github.com/egoist/vite-plugin-dts
 */
import dts, { PluginOptions as DtsPluginOptions } from 'vite-plugin-dts'
/**
 * @link https://github.com/davidmyersdev/vite-plugin-externalize-deps
 */
import { externalizeDeps } from 'vite-plugin-externalize-deps'
/**
 * @link https://www.npmjs.com/package/vite-plugin-lib-inject-css
 */
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { defineChunk } from 'vite-split-config'

import { mergeWith } from 'lodash-es'

const merge = <T>(a: T, b?: Partial<T>): T =>
  mergeWith(a, b, (a, b) => {
    if (Array.isArray(a)) return a.concat(b)
    return undefined
  })

type ExternalizeDepsOptions = Parameters<typeof externalizeDeps>[0]

interface BuildLibConfig {
  entry: LibraryOptions['entry']
  externalizeDeps?: ExternalizeDepsOptions
  dts?: DtsPluginOptions
}

export const useBuildLib = (cfg: BuildLibConfig) =>
  defineChunk({
    build: {
      lib: {
        entry: cfg.entry,
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      minify: false,
      sourcemap: true,
      copyPublicDir: false,

      rollupOptions: {
        plugins: [
          terser({
            format: {
              comments: false,
            },
          }),
        ],
      },
    },

    plugins: [
      externalizeDeps(cfg.externalizeDeps),

      dts(
        merge<DtsPluginOptions>(
          {
            exclude: ['**/*.{test,spec}.{ts,tsx}'],
            insertTypesEntry: true,
            // rollupTypes: true, // merge all declarations into a single file
          },
          cfg.dts
        )
      ),

      libInjectCss(),
    ],
  })
