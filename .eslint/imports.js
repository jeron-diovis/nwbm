import sysPath from 'node:path'

import plugin from 'eslint-plugin-import'

export default [
  plugin.flatConfigs.recommended,
  {
    settings: {
      // Fix recognition of 'external' module type for 'import/order' rule
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],

      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/newline-after-import': 'warn',

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
          alphabetize: {
            order: 'asc',
          },
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
              // Group React/Redux before other external
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

      'import/no-extraneous-dependencies': [
        'error',
        {
          packageDir: [
            /* current package, wherever lint is run from */
            '.',
            /* include deps from monorepo root */
            sysPath.dirname(import.meta.dirname),
          ],
          peerDependencies: true,
          devDependencies: [
            'eslint.config.js',
            '.eslint/**/*',
            // Stories have nothing to do with production build/env
            '**/{*.,}stories.{j,t}s{x,}',
            // Storybook configs
            '.storybook/**/*',
            // Tests
            '**/*.test.*',
            '**/setupTests.*',
            // Vite configs
            'vite.config.*',
            '.vite/*',
            '**/.vite*/*',
            // Other 'rc' config files
            '.*rc.{c,}{j,t}s',
            // demo
            '**/demo/**',
          ],
        },
      ],
    },
  },
]
