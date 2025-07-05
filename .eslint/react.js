import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs['recommended-latest'],
  pluginReactRefresh.configs.vite,
  {
    rules: {
      'react/jsx-key': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/destructuring-assignment': ['warn', 'always'],
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/jsx-curly-brace-presence': ['warn', 'never'],
    },
  },
]
