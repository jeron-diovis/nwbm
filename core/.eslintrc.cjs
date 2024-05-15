module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    './.eslint/index.cjs',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh'],

  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },

  overrides: [
    {
      /* infrastructure scripts/configs */
      files: ['!src/**'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['src/**/*.test.*'],
      rules: {
        'no-console': 'off',
      },
    },

    {
      files: ['**/*.js'],
      rules: {
        'no-undef': 'error',
      },
    },
  ],
}
