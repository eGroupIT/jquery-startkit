'use strict'
const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.config')
const config = require('../config')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    app: [
      'babel-polyfill',
      'isomorphic-fetch',
      './src/js',
    ],
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        }, {
          loader: 'resolve-url-loader',
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            parser: 'postcss-scss',
            plugins: [
              autoprefixer,
            ],
          },
        }],
      }),
    }]
  },
  // https://webpack.js.org/configuration/devtool/#production
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    // define global values
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'production'",
      },
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? {
        safe: true,
        map: {
          inline: false
        }
      } : {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'templates/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.common.assetsSubDirectory,
      ignore: ['.*']
    }]),
  ],
});

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
