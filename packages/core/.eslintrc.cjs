module.exports = {
  extends: ['../../.eslintrc.cjs'],

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
  ],
}
