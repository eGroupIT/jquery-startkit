'use strict'
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const utils = require('./utils');
const baseWebpackConfig = require('./webpack.base.config');
const config = require('./config');

const devWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',
	entry: {
		app: [
			'babel-polyfill',
			'isomorphic-fetch',
			'./src/app.js',
		],
	},
	output: {
		filename: '[name].js',
		publicPath: config.dev.assetsPublicPath
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		clientLogLevel: 'warning',
		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
			],
		},
		hot: true,
		contentBase: false,
		compress: true,
		host: 'localhost',
		port: config.dev.port,
		open: true,
		overlay: { warnings: false, errors: true },
		publicPath: config.dev.assetsPublicPath,
		// necessary for FriendlyErrorsPlugin
		quiet: true,
		// https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
		watchOptions: {
			poll: false,
		}
	},
	plugins: [
		// define global values
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: "'development'",
			},
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
		new webpack.NoEmitOnErrorsPlugin(),
		 // https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'templates/index.html',
			inject: true
		}),
		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.common.assetsSubDirectory,
				ignore: ['.*']
			}
		])
	],
});

module.exports = new Promise((resolve, reject) => {
	portfinder.basePort = process.env.PORT || config.dev.port
	portfinder.getPort((err, port) => {
		if (err) {
			reject(err)
		} else {
			// publish the new Port, necessary for e2e tests
			process.env.PORT = port
			// add port to devServer config
			devWebpackConfig.devServer.port = port

			// Add FriendlyErrorsPlugin
			devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
				compilationSuccessInfo: {
					messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
				},
				onErrors: config.dev.notifyOnErrors
				? utils.createNotifierCallback
				: undefined
			}))

			resolve(devWebpackConfig)
		}
	})
})