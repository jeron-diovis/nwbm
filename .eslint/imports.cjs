module.exports = {
  plugins: ['import'],

  settings: {
    // Fix recognition of 'external' module type for 'import/order' rule
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
  },

  rules: {
    'import/newline-after-import': 'warn',

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          /* Stories have nothing to do with production build/env, so they can safely use dev deps. */
          '**/{*.,}stories.{j,t}s{x,}',
          /* storybook configs */
          '.storybook/**/*',
          /* tests */
          '**/*.test.ts{x,}',
          /* vite configs */
          'vite.config.*',
          '.vite/*',
          '.vite-root/*',
          /* whatever other 'rc' config files */
          '.*rc{,.*}',
        ],

        /* @link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md#options
         * Without pointing to all package.json locations, rule can't validate deps provided by workspace. */
        packageDir: getPackageDirs(),
      },
    ],

    'sort-imports': [
      'warn',
      {
        // Declarations sort will be handled by `import/order` rule
        ignoreDeclarationSort: true,
      },
    ],

    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            // This is for vite.config-related files
            pattern: '*{vite,esbuild,rollup}*{/**,}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '*{react,redux}*{/**,}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'src/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '{./,../,}**.{s,}css',
            group: 'sibling',
            position: 'after',
          },
        ],
      },
    ],
  },
}

function getPackageDirs() {
  const CWD = process.cwd()
  const isPackage = require('../package.json').workspaces.some(pattern =>
    CWD.includes(pattern.replace('*', ''))
  )

  if (!isPackage) return undefined

  const sysPath = require('path')
  const PATH_TO_ROOT = sysPath.relative(CWD, sysPath.resolve(__dirname, '..'))

  return ['./', PATH_TO_ROOT]
}
