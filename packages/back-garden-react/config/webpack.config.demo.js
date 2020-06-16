/* eslint-disable @typescript-eslint/no-require-imports */
// default webpack config for demo

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '../src/demo.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        sideEffects: true,
      },
      // {
      //   test: /\.js$/,
      //   use: 'source-map-loader',
      //   enforce: 'pre',
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo.html',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
  },
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    host: '0.0.0.0',
    port: 8999,
    // open: true,
    compress: true,
    inline: true,
    hot: true,
    historyApiFallback: true,
  },
};
