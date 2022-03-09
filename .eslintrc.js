module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
  ],
  ignorePatterns: [
    '!.eslintrc.js',
  ],
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error', {
          allowExpressions: true,
        }],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/semi': ['error'],
        'no-shadow': 'off',
        semi: 'off',
      },
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
    },
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
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'sort-keys-fix',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': 'error',
    'import/extensions': 'off',
    indent: ['error', 2, {
      VariableDeclarator: 2,
    }],
    'max-len': ['error', {
      code: 150,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: false,
      ignoreUrls: true,
      tabWidth: 2,
    }],
    'multiline-ternary': ['error', 'always-multiline'],
    'no-console': 'error',
    'no-nested-ternary': 'warn',
    'operator-linebreak': ['error', 'before', {
      overrides: {
        '=': 'none',
      },
    }],
    semi: ['error', 'always'],
    'sort-keys-fix/sort-keys-fix': 'error',
  },
};
