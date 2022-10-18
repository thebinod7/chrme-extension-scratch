const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    popup:'./src/popup.jsx',
    background: './src/background.js',
    contentScript: './src/contentScript.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js', 
  },
  devServer: {
    port:3030,
  },
  module: {
    rules: [{ test: /\.(js|jsx)$/, exclude:/node_modules/, use: {
        loader:'babel-loader',
        options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
        }
    } },
    {
      test: /\.(sa|sc|c)ss$/, // styles files
      use: ["style-loader", "css-loader", "sass-loader"],
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg)$/, // to import images and fonts
      loader: "url-loader",
      options: { limit: false },
    },
  ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.join(__dirname, "public", "index.html"),
    filename:'popup.html'
  }),
  new CopyPlugin({
    patterns: [
      { from: "public"}
    ],
  }),
  new Dotenv({
    systemvars: true,}),
],
};
