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
    'plugin:promise/recommended'
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
    'unicorn/prefer-ternary': ['error', 'only-single-line'],
    'unicorn/template-indent': 'off'
  },
  ignorePatterns: ['node_modules']
};
