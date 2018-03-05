const fs = require('fs');

const gulp = require('gulp');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const bom = require('gulp-bom');
const clean = require('gulp-clean');
const rename = require('gulp-rename');

const src = './src';
const dist = './dist';
const serverDir = '../faceRecognizeWeb/src/main/webapp';

function writeDevPug() {
	// write globalVariable.pug
	const writeStream = fs.createWriteStream('src/pug/includes/globalVariable.pug');
	// write some data with a base64 encoding
	writeStream
		.write(`-
	const global = {
		production: false,
		cdnUrl: '',
	};`, 'utf8');

	// the finish event is emitted when all data has been flushed from the stream
	writeStream.on('finish', () => {
		console.log('wrote all data to file');
	});
}

function writeProductionPug(hashChunks) {
	// write globalVariable.pug
	const writeStream = fs.createWriteStream('src/pug/includes/globalVariable.pug');
	// write some data with a base64 encoding
	writeStream
		.write(`-
	const global = {
		production: true,
		cdnUrl: 'https://cdn.egroup.com.tw',
		manifest: '${hashChunks.manifest}',
		vendor: '${hashChunks.vendor}',
		main: '${hashChunks.main}',
		mainDashboard: '${hashChunks.mainDashboard}',
	};`, 'utf8');

	// the finish event is emitted when all data has been flushed from the stream
	writeStream.on('finish', () => {
		console.log('wrote all data to file');
	});
}

function createPugGlobalVariable(cb) {
	fs.readdir(`${serverDir}/js`, (err, files) => {
		// read filename
		const hashChunks = {};
		files.forEach((file) => {
			const splits = file.split('.');
			hashChunks[splits[0]] = splits[1];
		});
		cb(hashChunks);
	});
}

/**
 * create dev globalVariable.pug
 */
gulp.task('createDevGlobalVariable', () => {
	createPugGlobalVariable(writeDevPug);
});

/**
 * create production globalVariable.pug
 */
gulp.task('createProdGlobalVariable', () => {
	createPugGlobalVariable(writeProductionPug);
});

/**
 * pug to html
 */
gulp.task('pug', () => gulp.src([`${src}/pug/**/*.pug`, `!${src}/pug/includes/**`, `!${src}/pug/dashboard/includes/**`, `!${src}/pug/dashboard/layouts/**`, `!${src}/pug/dashboard/mixins/**`])
	.pipe(plumber({
		errorHandler(error) {
			gutil.log(error.message);
			this.emit('end');
		},
	}))
	.pipe(pug())
	.pipe(gulp.dest(dist)));

/**
 * clean jsp folder
 */
gulp.task('cleanJSP', () => gulp.src(`${serverDir}/WEB-INF/views/`, {
	read: false,
}).pipe(clean({
	force: true,
})));

/**
 * html to jsp
 */
gulp.task('toJSP', ['pug', 'cleanJSP'], () => gulp.src(`${dist}/**/*.html`)
	.pipe(bom())
	.pipe(rename({
		extname: '.jsp',
	}))
	.pipe(gulp.dest(`${serverDir}/WEB-INF/views/`)));

/**
 * dev
 */
gulp.task('dev', ['createDevGlobalVariable', 'toJSP'], () => {
	gulp.watch(`${src}/pug/**/*.pug`, ['toJSP']);
});

/**
 * production
 */
gulp.task('production', ['createProdGlobalVariable', 'toJSP']);

/**
 * copy assets to backend
 */
gulp.task('copyAssets', () => gulp.src(`${dist}/assets/**`)
	.pipe(gulp.dest(`${serverDir}/assets/`)));
