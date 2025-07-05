export default {
  rules: {
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-unreachable': 'warn',
    'no-duplicate-imports': 'warn',
    'no-var': 'error',
    'prefer-const': 'warn',
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'object-shorthand': 'warn',
    'one-var': ['error', 'never'],
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
      },
    ],
    'prefer-arrow-callback': [
      'warn',
      {
        allowUnboundThis: false,
        allowNamedFunctions: true,
      },
    ],
    'no-nested-ternary': 'off',
    'no-unneeded-ternary': 'warn',
    'no-prototype-builtins': 'off',
  },
}
