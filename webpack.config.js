const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    libraryTarget: 'umd',
    library: 'Test',
    umdNamedDefine: true,
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015'
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
}