/* Config in a package MUST exist.
 * lint-staged will search for a config _closest to the staged file being linted_.
 * @see https://www.npmjs.com/package/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo */

const { createDefaultConfig } = require('../../.lintstagedrc.scripts.cjs')

module.exports = createDefaultConfig('{src,demo,test}/**')
