const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {};

config.module = {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    },
    {
      test: /\.css$/,
      use: [
        'vue-style-loader',
        'css-loader'
      ]
    },
    {
      test: /\.less$/,
      use: [{
        loader: "style-loader" // 将 JS 字符串生成为 style 节点
      }, {
        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
      }, {
        loader: "less-loader"
      }]
    },
    {
      test: /\.(png|jpg|gif|webp)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    },
    {
      test: /\.svg/,
      loader: 'url-loader',
    }, {
      test: /\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    }
  ]
}

config.plugins = [
  new VueLoaderPlugin(),
]

module.exports = config;
