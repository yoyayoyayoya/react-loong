import localResolve from 'rollup-plugin-local-resolve'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV

const config = {
  input: 'src/index.js',
  external: ['react', 'loong'],
  output: {
    globals: {
      react: 'React',
      loong: 'Loong'
    },
    format: 'umd',
    name: 'ReactLoong'
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
      plugins: ['external-helpers']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs()
  ]
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
} else {
  config.plugins.push(localResolve())
}

export default config
