const webpack = require('webpack')
const path = require('path')
const CreateFileWebpack = require('create-file-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const _ = require('lodash')

const htmlTemplate = require('./src/html-template.js')

let APP_VERSION_STRING = require('./package.json').version

const APP_DIR = path.resolve(__dirname, 'src/')

let BUILD_DIR
let APP_PATH_STRING
let CSS_PATH_STRING

const htmlTemplateCompiler = _.template(htmlTemplate)

// const config
module.exports = (env) => {
  if (env === 'prod') {
    BUILD_DIR = path.resolve(__dirname, 'prod/')
    APP_PATH_STRING = 'https://iodide-project.github.io/iodide/dist/'
    CSS_PATH_STRING = 'https://iodide-project.github.io/iodide/dist/'
  } else if (env === 'dev') {
    BUILD_DIR = path.resolve(__dirname, 'dev/')
    APP_VERSION_STRING = 'dev'
    APP_PATH_STRING = ''
    CSS_PATH_STRING = ''
  }

  return {
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
            emitError: true,
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
          loader: `file-loader?name=iodide.${APP_VERSION_STRING}.fonts/[name].[ext]`,
        },
      ],
    },
    watchOptions: { poll: true },
    plugins: [
      new CreateFileWebpack({
        path: BUILD_DIR,
        fileName: `iodide.${APP_VERSION_STRING}.html`,
        content: htmlTemplateCompiler({
          APP_VERSION_STRING,
          APP_PATH_STRING,
          CSS_PATH_STRING,
          NOTEBOOK_TITLE: 'new notebook',
          JSMD: '',
        }),
      }),
      new webpack.DefinePlugin({
        IODIDE_VERSION: JSON.stringify(APP_VERSION_STRING),
        IODIDE_JS_PATH: JSON.stringify(APP_PATH_STRING),
        IODIDE_CSS_PATH: JSON.stringify(CSS_PATH_STRING),
      }),
      new ExtractTextPlugin(`iodide.${APP_VERSION_STRING}.css`),
    ],
  }
}

// module.exports = config
