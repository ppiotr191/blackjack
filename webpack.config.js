const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './src/script.js', 	
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
},
plugins: [
  new webpack.optimize.UglifyJsPlugin({
    minimize: true
  })
],
stats: {
    colors: true
},
devtool: 'source-map'
};