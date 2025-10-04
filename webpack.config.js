const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: 'inline-source-map',
  entry: {
    baekjoon: './src/scripts/baekjoon.js',
    
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
  },

  plugins: [
    new CopyPlugin({
      patterns : [
        { from: "./src/manifest.json", to: "./" },
        { from: "./src/assets", to: "./assets" },
        { from: "./src/css", to: "./css" },
        { from: "./src/popup.html", to: "./" },
        { from: "./src/popup.js", to: "./"},
        { from: "./src/library/jquery-3.7.1.min.js", to: "./library"}
      ]
    })
  ],

  resolve: {
    extensions: [".js"],
    alias: {
      sha1: "js-sha1",
      filesaver: "file-saver",
      "@": path.resolve(__dirname, "src/scripts"),
    },
  },
};
