const webpack = require('webpack');
const {
	resolve,
} = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');

// ../css/bundle.css means output location relative to output path
const extractCSS = new ExtractTextPlugin('../css/[name].[chunkhash].css');

// the path(s) that should be cleaned
const pathsToClean = [
	'js',
	'css',
];

// the clean options to use
const cleanOptions = {
	root: resolve(__dirname, '../faceRecognizeWeb/src/main/webapp'),
	verbose: true,
	dry: false,
};

module.exports = {
	entry: {
		main: './src/js/index.js',
		mainDashboard: './src/js/indexDashboard.js',
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: resolve(__dirname, '../faceRecognizeWeb/src/main/webapp/js'),
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
			loader: extractCSS.extract({
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
		}, {
			test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			include: resolve(__dirname, 'dist/assets/fonts'),
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: '../assets/fonts/',
				},
			},
		}, {
			test: /\.(png|jpg|svg|gif)$/,
			include: resolve(__dirname, 'dist/assets/images'),
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: '../assets/images/',
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
		// clean old js and css
		new CleanWebpackPlugin(pathsToClean, cleanOptions),
		// build optimization plugins
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.[chunkhash].js',
			minChunks: 2,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
		}),
		extractCSS,
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			// Compression specific options
			compress: {
				// remove warnings
				warnings: false,
				// Drop console statements
				drop_console: true,
			},
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// compile time plugins
		new webpack.DefinePlugin({
			S3IMAGEPATH: JSON.stringify('https://cdn.egroup.com.tw/image'),
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		// webpack enhancement plugins
		// new BundleAnalyzerPlugin(),
	],
};
