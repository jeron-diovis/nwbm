import eslint from '@eslint/js'
import ts_eslint from 'typescript-eslint'

import overrides from './.eslint/index.js'

export default ts_eslint.config(
  {
    languageOptions: {
      parser: ts_eslint.parser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },

    ignores: [
      '!.eslint',
      '!.vite',
      '!.lintstagedrc.cjs',
      '!.prettierrc.cjs',
      '!.storybook',
      'dist/',
      'build/',
    ],
  },

  eslint.configs.recommended,
  ts_eslint.configs.recommended,

  ...overrides
)
