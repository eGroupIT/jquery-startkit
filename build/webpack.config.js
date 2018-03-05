const webpack = require('webpack');
const {
	resolve,
} = require('path');

module.exports = {
	devtool: 'source-map',
	entry: {
		main: [
			'webpack-dev-server/client?http://localhost:7081',
			'webpack/hot/only-dev-server',
			'./src/js/index.js',
		],
		mainDashboard: [
			'webpack-dev-server/client?http://localhost:7081',
			'webpack/hot/only-dev-server',
			'./src/js/indexDashboard.js',
		],
	},
	output: {
		publicPath: 'http://localhost:7081/',
		filename: '[name].js',
		pathinfo: true,
	},
	module: {
		rules: [{
			test: /\.(js|vue)$/,
			loader: 'eslint-loader',
			enforce: 'pre',
			include: [resolve(__dirname, 'src'), resolve(__dirname, 'test')],
			options: {
				formatter: require('eslint-friendly-formatter'),
				emitWarning: true,
			},
		}, {
			test: /\.js$/,
			include: [resolve(__dirname, 'src'), resolve(__dirname, 'test')],
			use: [{
				loader: 'babel-loader',
			}],
		}, {
			test: /\.scss$/,
			use: [{
				loader: 'style-loader',
			}, {
				loader: 'css-loader',
				options: {
					sourceMap: true,
				},
			}, {
				loader: 'resolve-url-loader',
			}, {
				loader: 'sass-loader',
				options: {
					sourceMap: true,
				},
			}],
		}, {
			test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			include: resolve(__dirname, 'dist/assets/fonts'),
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'assets/fonts/',
				},
			},
		}, {
			test: /\.(png|jpg|svg|gif)$/,
			include: resolve(__dirname, 'dist/assets/images'),
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'assets/images/',
				},
			},
		}],
	},
	resolve: {
		modules: [
			resolve('./src/js'),
			resolve('node_modules'),
		],
		extensions: ['.js', '.scss'],
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		// build optimization plugins
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new webpack.DefinePlugin({
			S3IMAGEPATH: JSON.stringify('https://cdn.egroup.com.tw/image'),
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.js',
			minChunks: 2,
		}),
		// webpack-dev-server enhancement plugins
		new webpack.HotModuleReplacementPlugin(),
	],
	devServer: {
		proxy: { // proxy URLs to backend development server
			'/': 'http://localhost:9080',
		},
		contentBase: './dist',
		publicPath: 'http://localhost:7081/',
		historyApiFallback: true,
		port: 7081,
		hot: true,
		noInfo: true,
	},
};
