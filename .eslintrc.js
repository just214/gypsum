module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': 'off',
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'no-trailing-spaces': 'off',
    'object-shorthand': 'off',
    'import/prefer-default-export': 'off',
    // prettier-ignore
    'indent': 'off',
    'no-param-reassign': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
