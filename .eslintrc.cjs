module.exports = {
  root: true,
  env: { browser: true, es2020: true },

  settings: {
    react: {
      version: 'detect',
    },
  },

  ignorePatterns: [
    'dist',
    // Keep configs pretty too
    '!.eslint',
    '!.eslintrc.cjs',
    '!.vite',
    '!.lintstagedrc.cjs',
    '!.prettierrc.cjs',
    '!.storybook',
  ],

  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    './.eslint/index.cjs',
  ],

  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
