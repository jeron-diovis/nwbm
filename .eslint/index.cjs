module.exports = {
  extends: [
    './base.cjs',
    './typescript.cjs',
    './imports.cjs',
    './prettier.cjs',
  ],

  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        'no-undef': 'error',
      },
    },
    {
      files: ['**/*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.{c,}js'],
      env: {
        node: true,
      },
    },
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
  ],
}
