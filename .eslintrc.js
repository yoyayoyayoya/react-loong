module.exports = {
  extends: [
    'eslint:recommended',
    // 'plugin:import/recommended',
    'plugin:react/recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    browser: true,
    mocha: true,
    node: true
  },
  rules: {
    'valid-jsdoc': 2,
    'react/jsx-uses-react': 1,
    'react/jsx-no-undef': 2,
    'react/jsx-wrap-multilines': 2,
    'react/no-string-refs': 0
  },
  plugins: ['import', 'react'],
  overrides: [
    {
      files: 'test/**/*.js',
      env: {
        jest: true
      }
    }
  ]
}
