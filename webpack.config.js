const path = require('path');

module.exports = {
  entry: './src/global.js',
  output: {
    filename: 'vekta.js',
    path: path.resolve(__dirname, 'dist')
  }
};
