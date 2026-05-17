/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
      typescript: { project: './tsconfig.json' },
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    'react-native/no-inline-styles': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['node_modules/', 'dist/', 'android/', 'ios/', '.expo/'],
};
