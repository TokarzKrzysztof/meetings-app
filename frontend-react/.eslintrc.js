module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json'], extraFileExtensions: ['.css', '.svg'] },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/jsx-curly-brace-presence': ['warn', { props: 'always' }],
    'react/react-in-jsx-scope': ['off'],
    '@typescript-eslint/no-empty-function': ['warn'],
    '@typescript-eslint/ban-types': ['warn']
  },
  ignorePatterns: ['src/**/*.test.ts', 'src/frontend/generated/*'],
};
