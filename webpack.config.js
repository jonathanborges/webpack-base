const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./src/crop-thumb.js', './src/style.scss'],
  devtool: 'source-map',
  output: {
    libraryTarget: 'umd',
    library: 'CropThumb',
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
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: ['style-loader'],
          use: ['css-loader?sourceMap=true', 'sass-loader?sourceMap=true']
        })
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: "file-loader",
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: false,
    })
  ]
}