const { ESLint } = require('eslint')

const eslint = new ESLint()

/**
 * @see https://stackoverflow.com/questions/37927772/how-to-silence-warnings-about-ignored-files-in-eslint
 * @see https://github.com/lint-staged/lint-staged#eslint--7-1
 * With eslint it's impossible to silently run it over ignored files. They must be explicitly excluded from command's args.
 *
 * Warning can be suppressed with `--no-warn-ignored` option
 * @see https://eslint.org/docs/latest/use/command-line-interface#--no-warn-ignored
 * but that's only works with a new "flat config" mode, which requires migration.
 */
async function removeIgnoredFiles(files) {
  const is_ignored = await Promise.all(
    files.map(file => eslint.isPathIgnored(file))
  )
  const filtered = files.filter((_, i) => !is_ignored[i])
  return filtered.join(' ')
}

// ---

/**
 * @typedef LintStagedDict
 * @type object
 * @property {string} eslint
 * @property {string} ts
 * @property {string} stylelint
 */

/**
 * @typedef {Record<keyof LintStagedDict, string|function>} LintStagedConfig
 */

/**
 * @type {LintStagedDict}
 */
const FILES = {
  eslint: '*.{c,}{j,t}s{x,}',
  ts: '*.ts{x,}',
  stylelint: '*.{s,}css',
}

/**
 * @type {LintStagedConfig}
 */
const SCRIPTS = {
  eslint: async files =>
    `eslint --cache --fix --max-warnings=0 --no-error-on-unmatched-pattern ${await removeIgnoredFiles(
      files
    )}`,

  /**
   * @see https://www.npmjs.com/package/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
   * Must use a function value here.
   * If you specify just a string command, without function ≠ each changed file will be passed as args to that command.
   * And TS doesn't allow to specify both `--project` option and filenames in one command, so it will crash.
   *
   * With function here, command will run without passing specific files to it.
   *
   * This will validate ALL TS files in project.
   * It takes more time, but makes sense, because change in one file can break typings for other unchanged files.
   */
  ts: () => 'tsc -p tsconfig.json --noEmit',

  stylelint: 'stylelint --cache --fix --max-warnings=0 --allow-empty-input',
}

// ---

/**
 * @param {string|Partial<LintStagedDict>} base
 * @returns {LintStagedDict}
 */
function createPaths(base) {
  return Object.entries(FILES).reduce((acc, [fileType, filePattern]) => {
    const prefix = typeof base === 'string' ? base : base[fileType] ?? ''
    acc[fileType] = prefix === '' ? filePattern : `${prefix}/${filePattern}`
    return acc
  }, {})
}

/**
 * @param {string|Partial<LintStagedDict>} [base]
 * @returns {LintStagedConfig}
 */
function createDefaultConfig(base = {}) {
  return Object.entries(createPaths(base)).reduce(
    (acc, [fileType, filePattern]) => {
      acc[filePattern] = SCRIPTS[fileType]
      return acc
    },
    {}
  )
}

module.exports = {
  createDefaultConfig,
  SCRIPTS,
  FILES,
}
