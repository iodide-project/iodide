var path = require("path");
var config = require('./webpack.config.js');
var BundleTracker = require('webpack-bundle-tracker');

config.entry = './static/reactjs/index',

config.output = {
    path: path.resolve('./static/bundles/'),
    filename: "[name]-[hash].js",
}

config.plugins = [
    new BundleTracker({filename: './static/webpack-stats.json'}),
]

module.exports = config;
