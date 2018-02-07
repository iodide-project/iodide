const webpack = require('webpack')
const path = require('path')
const CreateFileWebpack = require('create-file-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const _ = require('lodash')

const htmlTemplate = require('./src/html-template.js')
const APP_VERSION_STRING = require('./package.json').version

const BUILD_DIR = path.resolve(__dirname, 'dist/')
const APP_DIR = path.resolve(__dirname, 'src/')

const htmlTemplateCompiler = _.template(htmlTemplate)

const config = {
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    filename: `iodide.${APP_VERSION_STRING}.js`,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
          emitWarning: true,
        },
      },
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          // filename: `iodide.${APP_VERSION_STRING}.css`,
        }),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        loader: `file-loader?name=iodide.${APP_VERSION_STRING}.fonts/[name].[ext]`
      },
    ],
  },
  watchOptions: { poll: true },
  plugins: [
    new CreateFileWebpack({
      path: './dist',
      fileName: `iodide.${APP_VERSION_STRING}.html`,
      content: htmlTemplateCompiler({
        APP_VERSION_STRING,
        NOTEBOOK_TITLE: 'new notebook',
        APP_PATH_STRING: '',
        CSS_PATH_STRING: '',
        JSMD: '',
      }),
    }),
    new webpack.DefinePlugin({
      IODIDE_VERSION: JSON.stringify(APP_VERSION_STRING),
    }),
    new ExtractTextPlugin(`iodide.${APP_VERSION_STRING}.css`)
  ],
}

module.exports = config
