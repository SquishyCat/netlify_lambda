const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    alias: {
      'gamesparks': path.resolve(__dirname, 'src/lib/'),
    }
  },
  node: {
    fs: "empty",
  },
  devtool: "inline-source-map",
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/lib',
        to: 'lib',
      },
      'src/index.html',
    ]),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      API_KEY: JSON.stringify(process.env.API_KEY),
      LAMBDA_ENDPOINT: JSON.stringify(process.env.LAMBDA_ENDPOINT)
    })
  ]
};
