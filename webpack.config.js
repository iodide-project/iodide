require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const minimist = require('minimist')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const UnusedWebpackPlugin = require("unused-webpack-plugin");
const _ = require("lodash");

const reduxLogMode = process.env.REDUX_LOGGING
  ? process.env.REDUX_LOGGING
  : "SILENT";

const ARGV = minimist(process.argv.slice(2));
const DEV_SERVER_PORT = ARGV.port || 8000;

const BUILD_DIR = path.resolve(__dirname, "build/");

let { EDITOR_ORIGIN } = process.env;
let { EVAL_FRAME_ORIGIN } = process.env;
const { USE_OPENIDC_AUTH } = process.env;
const { IODIDE_PUBLIC } = process.env || false;
const { USE_LOCAL_PYODIDE } = process.env || false;
const { SOURCE_VERSION } = process.env;

const IS_PRODUCTION = process.env.NODE_ENV !== "dev";

const APP_DIR = path.resolve(__dirname, "src/");

const plugins = [];

module.exports = env => {
  env = env || ""; // eslint-disable-line no-param-reassign
  process.env.NODE_ENV = env.NODE_ENV || "production";

  // default case: heroku or local python server using docker-compose
  EDITOR_ORIGIN =
    EDITOR_ORIGIN ||
    process.env.SERVER_URI ||
    `http://localhost:${DEV_SERVER_PORT}/`;

  EVAL_FRAME_ORIGIN = EVAL_FRAME_ORIGIN || EDITOR_ORIGIN;

  return {
    entry: {
      iodide: `${APP_DIR}/editor/index.jsx`,
      "iodide.eval-frame": `${APP_DIR}/eval-frame/index.jsx`,
      "server.home": `${APP_DIR}/server/index.jsx`
    },
    output: {
      path: BUILD_DIR,
      filename: `[name].js`
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
          loader: `file-loader?name=iodide.fonts/[name].[ext]`
        }
      ]
    },
    watchOptions: { poll: true, ignored: /node_modules/ },
    optimization: {
      minimize: IS_PRODUCTION,
      minimizer: [new TerserPlugin({
        sourceMap: true,
      })],
    },
    plugins: [
      ...plugins,
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd()
      }),
      new UnusedWebpackPlugin({
        directories: [path.join(__dirname, "src")], // Source directories
        exclude: ["*.test.js"], // Exclude patterns
        root: __dirname // Root directory (optional)
      }),
      new LodashModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        React: "react",
        ReactDOM: "react-dom",
        $: "jquery",
        jQuery: "jquery"
      }),
      new webpack.EnvironmentPlugin(["NODE_ENV"]),
      new webpack.DefinePlugin({
        "process.env.IODIDE_VERSION": JSON.stringify("dev"),
        "process.env.IODIDE_REDUX_LOG_MODE": JSON.stringify(reduxLogMode),
        "process.env.USE_LOCAL_PYODIDE": JSON.stringify(USE_LOCAL_PYODIDE),
        "process.env.USE_OPENIDC_AUTH": JSON.stringify(USE_OPENIDC_AUTH),
        "process.env.IODIDE_PUBLIC": !!IODIDE_PUBLIC,
        // we don't have access to the git checkout on heroku, so use the
        // environment variable "SOURCE_VERSION" which contains the hash
        "process.env.COMMIT_HASH": JSON.stringify(
          SOURCE_VERSION ||
            new GitRevisionPlugin({
              commithashCommand: "rev-list master --max-count=1"
            }).commithash()
        )
      }),
      new MiniCssExtractPlugin({
        filename: `[name].css`
      }),
      new WriteFilePlugin()
    ],
    devServer: {
      before: app => {
        _.forEach(
          {
            "/": _.template(fs.readFileSync("./src/editor/static.html"))({
              EVAL_FRAME_ORIGIN
            }),
            "/eval-frame/": _.template(
              fs.readFileSync("./src/eval-frame/static.html")
            )({ EDITOR_ORIGIN })
          },
          (content, path) =>
            app.get(path, (req, res) => {
              res.set("Content-Type", "text/html");
              res.send(content);
            })
        );
      },
      contentBase: path.join(__dirname, "build"),
      port: DEV_SERVER_PORT,
      hot: false,
      inline: false
    }
  };
};
