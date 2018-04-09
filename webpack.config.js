const webpack = require('webpack')
const path = require('path')
const CreateFileWebpack = require('create-file-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const _ = require('lodash')
const gitRev = require('git-rev-sync')

const htmlTemplate = require('./src/html-template.js')

let BUILD_DIR
let APP_PATH_STRING
let CSS_PATH_STRING
let APP_VERSION_STRING

if (gitRev.isTagDirty()) {
  if (process.env.TRAVIS_BRANCH !== undefined) {
    // On Travis-CI, the git branches are detached so use env variable instead
    APP_VERSION_STRING = process.env.TRAVIS_BRANCH
  } else {
    APP_VERSION_STRING = gitRev.branch()
  }
} else {
  APP_VERSION_STRING = gitRev.tag()
}

const APP_DIR = path.resolve(__dirname, 'src/')
const EXAMPLE_DIR = path.resolve(__dirname, 'examples/')


const htmlTemplateCompiler = _.template(htmlTemplate)

// const config
module.exports = (env) => {
  if (env === 'prod') {
    BUILD_DIR = path.resolve(__dirname, 'prod/')
    if (gitRev.isTagDirty()) {
      APP_PATH_STRING = 'https://iodide-project.github.io/master/'
    } else {
      APP_PATH_STRING = 'https://iodide-project.github.io/dist/'
    }
    CSS_PATH_STRING = APP_PATH_STRING
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
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            // eslint options (if necessary)
            emitWarning: true,
            emitError: true,
            extensions: ['.jsx', '.js'],
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
        {
          test: /\.jsmd$/,
          include: EXAMPLE_DIR,
          loader: 'raw-loader',
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
        IODIDE_BUILD_MODE: JSON.stringify(env),
      }),
      new ExtractTextPlugin(`iodide.${APP_VERSION_STRING}.css`),
    ],
  }
}

// module.exports = config
