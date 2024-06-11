import checker from 'vite-plugin-checker'
import { defineChunk } from 'vite-split-config'

interface LintScripts {
  eslint: string
  stylelint: string
}

export const useLint = (scripts: LintScripts) =>
  defineChunk({
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
        typescript: true,

        /**
         * Add `--max-warnings=0` to make `vite build` fail if anything violates lint rules.
         * Somehow, this does not affect behavior of dev mode.
         */
        eslint: { lintCommand: `${scripts.eslint} --max-warnings=0` },
        stylelint: {
          lintCommand: `${scripts.stylelint} --max-warnings=0`,
        },

        /** Sadly, it's impossible to manage linter's severity with this plugin,
         * so by default it will open overlay for any non-important warnings.
         * With this, it's collapses to a tiny window in a corner, and stay that until you ask.
         */
        overlay: { initialIsOpen: false },
      }),
    ],
  })
