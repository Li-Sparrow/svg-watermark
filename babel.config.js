const pkg = require('./package.json');

module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['transform-define', { SVG_WATERMARK_VERSION: pkg.version }]
  ],
};
