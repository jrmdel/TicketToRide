module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['node_modules/*'],
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    curly: ['error', 'all'], // Enforce braces for all control statements
    'prefer-const': 'error',
  },
};
