module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  ignorePatterns: [
    '!.eslintrc.js',
  ],
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ['src/**/*.spec.ts'],
      rules: {
        'func-names': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
  },
};
