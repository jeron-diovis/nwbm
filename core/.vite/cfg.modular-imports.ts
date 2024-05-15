import importus from 'vite-plugin-importus'
import { defineChunk } from 'vite-split-config'

export const useModularImports = defineChunk({
  plugins: [
    importus([
      /**
       * With ES modules, it is MUCH better to use lodash-es than regular lodash.
       * For example, importing `filter` module from lodash-es is ~518B, while from lodash – 73.3kB (!!).
       *
       * lodash-es does not support lodash/fp version – but, it appears, that due to how lodash-fp works,
       * rewriting it's import paths is completely useless.
       * Single-function module still pulls tons of internal helpers, and you win literally nothing in bundle size.
       *
       * So.
       * For normal lodash helpers, use lodash-es.
       * For fp version, switch to Ramda or whatever specialized lib.
       */
      patch('lodash-es'),

      patch('ramda', 'ramda/es'),
      patch('date-fns'),
      // TODO: MUI
    ]),
  ],
})

// ---

// not exported from package, sadly
type LibImportConfig = Parameters<typeof importus>[0][0]

function patch(
  libraryName: string,
  transform: string | ((importName: string) => string) = libraryName
): LibImportConfig {
  return {
    libraryName,
    camel2DashComponentName: false,
    customName:
      typeof transform === 'function'
        ? transform
        : (importName: string) => `${transform}/${importName}`,
  }
}
