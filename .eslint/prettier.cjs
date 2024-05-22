module.exports = {
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended'],

  rules: {
    // prettier handles this on its own
    quotes: 0,
    '@typescript-eslint/no-extra-semi': 0,
  },
}
