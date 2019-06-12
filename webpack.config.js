require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const CreateFileWebpack = require("create-file-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const UnusedWebpackPlugin = require("unused-webpack-plugin");
const _ = require("lodash");

const reduxLogMode =
  process.env.REDUX_LOGGING === "VERBOSE" ? "VERBOSE" : "SILENT";

const evalFrameHtmlTemplate = require("./src/eval-frame/html-template.js");
const evalFrameHtmlTemplateCompiler = _.template(evalFrameHtmlTemplate);

const DEV_SERVER_PORT = 8000;

const BUILD_DIR = path.resolve(__dirname, "build/");
let APP_PATH_STRING;
let CSS_PATH_STRING;

let { EDITOR_ORIGIN } = process.env;
let { EVAL_FRAME_ORIGIN } = process.env;
const { USE_OPENIDC_AUTH } = process.env;
const { IODIDE_PUBLIC } = process.env || false;
const { USE_LOCAL_PYODIDE } = process.env || false;

const APP_VERSION_STRING = process.env.APP_VERSION_STRING || "dev";

const APP_DIR = path.resolve(__dirname, "src/");

const plugins = [];

// const config
module.exports = env => {
  env = env || ""; // eslint-disable-line no-param-reassign

  if (!env.startsWith("dev")) {
    plugins.push(new UglifyJSPlugin());
  }

  // default case: heroku or local python server using docker-compose
  EDITOR_ORIGIN =
    EDITOR_ORIGIN ||
    process.env.SERVER_URI ||
    `http://localhost:${DEV_SERVER_PORT}/`;
  APP_PATH_STRING = `${EDITOR_ORIGIN}/`;
  CSS_PATH_STRING = `${EDITOR_ORIGIN}/`;

  EVAL_FRAME_ORIGIN = EVAL_FRAME_ORIGIN || EDITOR_ORIGIN;

  return {
    entry: {
      iodide: `${APP_DIR}/editor/index.jsx`,
      "iodide.eval-frame": `${APP_DIR}/eval-frame/index.jsx`,
      "server.home": `${APP_DIR}/server/index.jsx`
    },
    output: {
      path: BUILD_DIR,
      filename: `[name].${APP_VERSION_STRING}.js`
    },
    devtool: "source-map",
    resolve: {
      extensions: [".js", ".jsx"]
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {
            // eslint options (if necessary)
            emitWarning: true,
            emitError: true,
            extensions: [".jsx", ".js"]
          }
        },
        {
          test: /\.jsx?/,
          include: APP_DIR,
          loader: "babel-loader",
          options: {
            plugins: ["lodash"],
            presets: [
              ["@babel/preset-env", { modules: false, targets: { node: 6 } }]
            ]
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          loader: `file-loader?name=iodide.${APP_VERSION_STRING}.fonts/[name].[ext]`
        }
      ]
    },
    watchOptions: { poll: true, ignored: /node_modules/ },
    plugins: [
      ...plugins,
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd()
      }),
      new UnusedWebpackPlugin({
        // Source directories
        directories: [path.join(__dirname, "src")],
        // Exclude patterns
        exclude: ["*.test.js"],
        // Root directory (optional)
        root: __dirname
      }),
      new LodashModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        React: "react",
        ReactDOM: "react-dom",
        $: "jquery",
        jQuery: "jquery"
      }),
      new CreateFileWebpack({
        path: BUILD_DIR,
        fileName: `iodide.eval-frame.${APP_VERSION_STRING}.html`,
        content: evalFrameHtmlTemplateCompiler({
          APP_VERSION_STRING: `eval-frame.${APP_VERSION_STRING}`,
          EVAL_FRAME_ORIGIN,
          CSS_PATH_STRING,
          NOTEBOOK_TITLE: "new notebook",
          IOMD: ""
        })
      }),
      new webpack.DefinePlugin({
        IODIDE_VERSION: JSON.stringify(APP_VERSION_STRING),
        IODIDE_EVAL_FRAME_ORIGIN: JSON.stringify(EVAL_FRAME_ORIGIN),
        IODIDE_EDITOR_ORIGIN: JSON.stringify(EDITOR_ORIGIN),
        IODIDE_JS_PATH: JSON.stringify(APP_PATH_STRING),
        IODIDE_CSS_PATH: JSON.stringify(CSS_PATH_STRING),
        IODIDE_BUILD_MODE: JSON.stringify(
          env && env.startsWith("dev") ? "dev" : "production"
        ),
        IODIDE_REDUX_LOG_MODE: JSON.stringify(reduxLogMode),
        USE_LOCAL_PYODIDE: JSON.stringify(USE_LOCAL_PYODIDE),
        USE_OPENIDC_AUTH: JSON.stringify(USE_OPENIDC_AUTH),
        IODIDE_PUBLIC: !!IODIDE_PUBLIC
      }),
      new MiniCssExtractPlugin({
        filename: `[name].${APP_VERSION_STRING}.css`
      }),
      new WriteFilePlugin()
      // Use an external helper script, due to https://github.com/1337programming/webpack-shell-plugin/issues/41
    ],
    devServer: {
      contentBase: path.join(__dirname, "build"),
      port: DEV_SERVER_PORT,
      hot: false,
      inline: false
    }
  };
};
