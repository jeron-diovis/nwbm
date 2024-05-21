module.exports = {
  extends: ['plugin:prettier/recommended'],

  rules: {
    // prettier handles this on it's own
    quotes: 0,
    '@typescript-eslint/no-extra-semi': 0,
  },
}
