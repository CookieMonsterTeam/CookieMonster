module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    Game: 'writable',
    l: 'readonly',
    b64_to_utf8: 'readonly',
    utf8_to_b64: 'readonly',
    BeautifyAll: 'readonly',
    PlaySound: 'readonly',
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'import/no-mutable-exports': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-new-func': 'off',
    'func-names': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    'no-restricted-globals': 'off',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'max-len': [
      1,
      {
        code: 100,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
