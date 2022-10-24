module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'jsdoc', 'prettier', 'promise', 'unicorn'],
  rules: {
    camelcase: ['error', { properties: 'always' }],
    eqeqeq: ['error', 'always'],
    'no-nested-ternary': 'off',
    'unicorn/prefer-ternary': ['error', 'only-single-line'],
    'unicorn/template-indent': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/prefer-node-protocol': 'off'
  },
  ignorePatterns: ['node_modules']
};
