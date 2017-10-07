const path = require('path');

module.exports = {
  entry: './src/script.js', 	
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  }
};