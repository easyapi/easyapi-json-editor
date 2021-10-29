const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');

const config = baseConfig;

config.mode = 'development';

config.entry = './example/main.js';
config.output = {
  path: path.resolve(__dirname, './example/dist/'),
  publicPath: '',
  filename: '[name]_[hash].js',
};

config.devtool = 'inline-source-map';
config.devServer = {
  static: {
    directory: path.join(__dirname, 'dist')
  },
  compress: true
};

config.plugins = config.plugins.concat([
  new HtmlWebpackPlugin({
    template: './example/index.html'
  })
]);

module.exports = config;
