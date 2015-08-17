var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: path.resolve('core/client/index'),
  output: {
    path: path.resolve('public/assets/js'),
    filename: 'app.js'
  },
  plugins: [
    new webpack.IgnorePlugin(/lowdb/)
  ],
  module: {
    exprContextRegExp: /$^/,
    exprContextCritical: false
  }
};
