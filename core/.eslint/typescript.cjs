module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],

  rules: {
    '@typescript-eslint/no-empty-interface': [
      'warn',
      {
        allowSingleExtends: true,
      },
    ],
    // Pointless rule. no-op funcs can be used pretty often
    '@typescript-eslint/no-empty-function': 'off',
    // Aliases may be quite useful for readability
    '@typescript-eslint/no-this-alias': 'off',
    // It's a good rule, and it's worth to try to follow it –
    // but using it completely nullifies all the benefits from type inference.
    // Manually declaring return types for wrappers around 3-party library helpers can be quite complicated –
    // like, return type of _.debounce, or some redux-toolkit helpers, etc.
    // It quickly becomes way too time-consuming, with not so much benefit.
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Explicit `any` often may be needed for generic helpers.
    // Especially when working with complex 3-party types. `unknown` is just not enough there.
    // But that cases are still exceptions. Normally, explicit `any` in your code is a vulnerability.
    // So it's would be better to manually disable linter for some specific line, rather than allow `any` everywhere.
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        ignoreRestArgs: true,
      },
    ],

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        // In very rare cases, suppressing errors may be needed.
        // But never just ignore, always require some explanation.
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10,
      },
    ],

    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          // Allow to use `object`.
          // Despite of certain potential problems with this type
          // (@see https://github.com/microsoft/TypeScript/issues/21732),
          // using `Record` instead of it is not always suitable – because of another weird TS 'feature':
          // @see https://stackoverflow.com/questions/55814516/typescript-why-type-alias-satisfies-a-constraint-but-same-interface-doesnt
          object: false,
        },
      },
    ],

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        // react-app config sets this to `none`.
        // Which ignores unused args completely.
        args: 'after-used',
        // @see https://eslint.org/docs/rules/no-unused-vars#ignorerestsiblings
        // react-app config already sets this to `true`, we should restore it since we override those options.
        ignoreRestSiblings: true,
      },
    ],

    // With this operator there is much less code to write when you know what you're doing,
    // then with optional chaining or other workarounds.
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}
