'use strict'
const webpack = require('webpack');
const path = require('path');

module.exports = {
  // The base directory, an absolute path, for resolving entry points and loaders from configuration.
	context: path.resolve(__dirname, '../'),
	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: 'static/images/[name].[hash:7].[ext]',
			},
		}, {
			test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: 'static/media/[name].[hash:7].[ext]',
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: 'static/fonts/[name].[hash:7].[ext]',
			},
		}],
	},
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