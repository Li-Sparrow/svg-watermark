/*eslint-env node*/

const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const tsRules = {
  test: /\.ts$/,
  include: [resolve(__dirname, "src")],
  use: ["babel-loader"],
};

const lessRules = {
  test: /\.less$/,
  include: [resolve(__dirname, "src")],
  use: ["style-loader", "css-loader", "less-loader"],
};

const sourceMapRules = {
  test: /\.js$/,
  enforce: "pre",
  use: ["source-map-loader"],
};

module.exports = {
  entry: {
    "svg-watermark": "./src/index.ts"
  },
  output: {
    filename: "svg-watermark.js",
    library: {
      name: "SvgWatermark",
      type: "umd",
      export: "default",
    },
    path: resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".js", ".ts"],
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
  module: {
    rules: [tsRules, lessRules, sourceMapRules],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "./index.html"),
      scriptLoading: "blocking",
    }),
  ],
};