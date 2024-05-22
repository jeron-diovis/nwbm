module.exports = {
  extends: ['plugin:jsx-control-statements/recommended'],

  rules: {
    // @see https://github.com/vkbansal/eslint-plugin-jsx-control-statements#important
    'react/jsx-no-undef': ['error', { allowGlobals: true }],
    // Don't enforce using <If> / <Choose>, because for simple one-liners, ternary is often much more convenient.
    // Like, {active ? <IconActive /> : <IconInactive />}
    'jsx-control-statements/jsx-use-if-tag': 'off',
    // This rule doesn't work with typescript.
    // It reports code like `ReturnType<typeof something>` as `'something' is not defined`.
    'jsx-control-statements/jsx-jcs-no-undef': 'off',
  },
}
