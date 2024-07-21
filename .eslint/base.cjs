module.exports = {
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unreachable': 'warn',
    'no-var': 'error',
    'prefer-const': 'warn',
    'no-param-reassign': [
      'error',
      {
        // Allow to modify props. Mostly, to support immer producers.
        props: false,
      },
    ],
    'no-duplicate-imports': 'warn',
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

    'react/jsx-key': 'warn',
    'react/jsx-boolean-value': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/destructuring-assignment': ['warn', 'always'],
    // aiming modern browsers which manage this by default
    'react/jsx-no-target-blank': 'off',
  },
}
