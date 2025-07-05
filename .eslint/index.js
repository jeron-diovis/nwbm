import cfgBase from './base.js'
import cfgImports from './imports.js'
import cfgPrettier from './prettier.js'
import cfgReact from './react.js'
import cfgTS from './typescript.js'

export default [
  cfgBase,
  cfgTS,
  cfgImports,
  cfgPrettier,
  cfgReact,

  {
    // infrastructure scripts/configs
    files: ['!**/src/**'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.test.*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-undef': 'error',
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
