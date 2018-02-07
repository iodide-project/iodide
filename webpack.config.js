const webpack = require('webpack')
const path = require('path')
const CreateFileWebpack = require('create-file-webpack')
const htmlTemplate = require('./src/html-template.js')
const _ = require('lodash')

const APP_VERSION_STRING = require("./package.json").version

const BUILD_DIR = path.resolve(__dirname, 'dist/')
const APP_DIR = path.resolve(__dirname, 'src/')

const htmlTemplateCompiler = _.template(htmlTemplate)

let config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'iodide.'+APP_VERSION_STRING+'.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
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
  plugins: [
    new CreateFileWebpack({
      path: './dist',
      fileName: 'iodide.dev.html',
      content: htmlTemplateCompiler({
        NOTEBOOK_TITLE: 'new notebook',
        APP_PATH_STRING: '',
        CSS_PATH_STRING: '',
        APP_VERSION_STRING: APP_VERSION_STRING,
        JSMD: ''
      })
    }),
    new webpack.DefinePlugin({
      IODIDE_VERSION: JSON.stringify(APP_VERSION_STRING)
    })
  ]
}

module.exports = config