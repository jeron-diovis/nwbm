import { existsSync } from 'node:fs'
import sysPath from 'path'

import checker from 'vite-plugin-checker'
import { defineChunk } from 'vite-split-config'

interface LintScripts {
  eslint: string
  stylelint?: string
}

type CheckerTsConfig = Parameters<typeof checker>[0]['typescript']

export const useLint = (scripts: LintScripts) =>
  defineChunk((_, { vite }) => {
    return {
      plugins: [
        /**
         * There are separate plugins for js and css:
         * @see https://www.npmjs.com/package/vite-plugin-eslint
         * @see https://www.npmjs.com/package/vite-plugin-stylelint
         * They have more options and allow for a good fine-grained output.
         * BUT they work each on their own, overwriting console output of each other.
         * And we need some workaround for typescript checks also.
         *
         * This plugin handles everything at once integrally – at cost of a worse configurability.
         */
        checker({
          typescript: vite.mode === 'test' ? getTestEnvTsConfig() : true,

          /**
           * Add `--max-warnings=0` to make `vite build` fail if anything violates lint rules.
           * Somehow, this does not affect behavior of dev mode.
           */
          eslint: { lintCommand: `${scripts.eslint} --max-warnings=0` },

          ...(scripts.stylelint && {
            stylelint: {
              lintCommand: `${scripts.stylelint} --max-warnings=0`,
            },
          }),

          /** Sadly, it's impossible to manage linter's severity with this plugin,
           * so by default it will open overlay for any non-important warnings.
           * With this, it's collapses to a tiny window in a corner, and stay that until you ask.
           */
          overlay: { initialIsOpen: false },
        }),
      ],
    }
  })

function getTestEnvTsConfig(): CheckerTsConfig {
  const fileName = 'tsconfig.test.json'
  const filePath = sysPath.join(process.cwd(), fileName)
  if (existsSync(filePath)) return { tsconfigPath: fileName }
  return true
}
