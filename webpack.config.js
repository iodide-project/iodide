let webpack = require('webpack')
let path = require('path')

let BUILD_DIR = path.resolve(__dirname, 'dist/')
let APP_DIR = path.resolve(__dirname, 'src/')

let config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  devtool: 'source-map',

  module : {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
          emitWarning: true
        }
      },
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  watchOptions: {
    poll: true
  },
}

module.exports = config