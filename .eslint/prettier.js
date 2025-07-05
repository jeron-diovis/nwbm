import plugin from 'eslint-plugin-prettier/recommended'

export default [
  plugin,
  {
    rules: {
      quotes: 0,
      '@typescript-eslint/no-extra-semi': 0,
    },
  },
]
