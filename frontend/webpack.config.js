const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname,'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'public'),
    publicPath: path.resolve(__dirname, '..', 'public')
  },
  devtool: "source-map",
  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.(tsx|ts)$/, use: [{loader: 'babel-loader'}] },
      { test: /\.css$/, use: ['style-loader','css-loader']}
    ]
  }
};
