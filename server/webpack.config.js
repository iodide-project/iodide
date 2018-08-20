var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

module.exports = {
  mode: 'development',
  
  context: __dirname,

  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './static/reactjs/index',
  ],

  output: {
      path: path.resolve('./static/bundles/'),
      filename: "[name]-[hash].js",
      publicPath: 'http://localhost:3000/assets/bundles/',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
    new BundleTracker({filename: './static/webpack-stats.json'}),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // STYLES
      {
          test: /\.css$/,
          use: [
              'style-loader',
              {
                  loader: 'css-loader',
                  options: {
                      sourceMap: IS_DEV
                  }
              },
          ]
      },
      // IMAGES
      {
          test: /\.(jpe?g|png|gif)$/,
          loader: 'file-loader',
          options: {
              name: '[path][name].[ext]'
          }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }

};
