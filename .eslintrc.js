module.exports = {
  extends: 'react-app',
  parser: 'babel-eslint',
  overrides: [
    {
      files: 'test/**/*.js',
      env: {
        jest: true
      }
    }
  ]
}
