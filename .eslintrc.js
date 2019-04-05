module.exports = {
  root: true,
  extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: true,
  },
  env: {
    node: true,
  },
  rules: {
    strict: 'error',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'class-methods-use-this': 'off',
    'prettier/prettier': 'error',
    strict: 'error',
    'no-restricted-syntax': 'off',
    'jsdoc/check-param-names': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-example': 0,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
  },
  plugins: ['prettier', 'jsdoc'],
  overrides: [
    {
      files: ['*.test.js', '*.spec.js', 'test/**/*.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
        'no-param-reassign': 'off',
      },
    },
  ],
};
