module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    "react/no-unescaped-entities": ['off'],
    'react/jsx-curly-brace-presence': ['warn', { props: 'never' }],
    'react/react-in-jsx-scope': ['off'],
    'react-hooks/exhaustive-deps': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    '@typescript-eslint/no-empty-function': ['warn'],
    '@typescript-eslint/ban-types': [
      'warn',
      {
        types: {
          '{}': false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    quotes: ['warn', 'single'],
    'jsx-quotes': ['warn', 'prefer-single'],
    'no-unused-vars': ['off'],
    'no-debugger': ['warn'],
    'no-constant-condition': ['warn'],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'axios',
            importNames: ['default'],
            message: 'Please use "src/config/axios-config" instead',
          },
        ],
      },
    ],
  },
  ignorePatterns: ['src/**/*.test.ts', 'src/frontend/generated/*', '**.css', '**.png'],
};
