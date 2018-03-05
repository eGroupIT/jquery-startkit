'use strict'
const path = require('path');

module.exports = {
  common: {
    assetsSubDirectory: 'static',
  },

  dev: {
    assetsPublicPath: '/',

    // dev server
    port: 8080,
  },

  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    productionSourceMap: true,
    bundleAnalyzerReport: true
  },
};
