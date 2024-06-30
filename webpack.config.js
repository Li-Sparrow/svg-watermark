/*eslint-env node*/

const { BannerPlugin, DefinePlugin } = require('webpack');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { readFileSync } = require('fs');
const { join, resolve } = require('path');

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

const bannerPack = new BannerPlugin({
  banner: [
    `SVG Watermark v${pkg.version}`,
    pkg.homepage,
    `Copyright (c) 2024-${new Date().getFullYear()}, Slab`,
  ].join('\n'),
  entryOnly: true,
});

const constantPack = new DefinePlugin({
  SVG_WATERMARK_VERSION: JSON.stringify(pkg.version),
});

module.exports = (env) =>
  merge(common, {
    mode: env.production ? 'production' : 'development',
    devtool: 'source-map',
    plugins: [bannerPack, constantPack],
    devServer: {
      static: {
        directory: resolve(__dirname, './dist'),
      },
      hot: true,
      allowedHosts: 'all',
      devMiddleware: {
        stats: 'minimal',
      },
    },
    stats: 'minimal',
  });