'use strict'
const webpack = require('webpack');
const path = require('path');

const utils = require('./utils');

module.exports = {
  // The base directory, an absolute path, for resolving entry points and loaders from configuration.
	context: path.resolve(__dirname, '../'),
	resolve: {
		extensions: ['.js'],
	// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
		alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('src'),
    }
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: utils.createVueLoaderOptions()
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: utils.assetsPath('images/[name].[hash:7].[ext]'),
			},
		}, {
			test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: utils.assetsPath('media/[name].[hash:7].[ext]'),
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
			},
		}],
	},
	plugins: [
    new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
  ],
	node: {
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
}