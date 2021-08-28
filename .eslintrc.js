module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/eslint-config-airbnb',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'global-require': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['warn', { allow: ['error', 'warn'] }]
        : 'off',
    'prettier/prettier': 'error',
    'vue/no-unused-vars': 'error',
  },
};
