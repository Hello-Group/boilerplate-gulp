const _gulp = require('gulp');
const _sourcemaps = require('gulp-sourcemaps');
const _browserify = require('browserify');
const _pathmodify = require('pathmodify');
const _vinylSourceStream = require('vinyl-source-stream');
const _vinylBuffer = require('vinyl-buffer');
const _uglify = require('gulp-uglify');
const _utils = require('./utils');

const _paths = {
	srcDir : 'src/js/',
	distDir : 'dist/js/',
	srcFile : 'app.js',
	distFile : 'app.js'
};

const _compile = {
	dev: () => {
		return _browserify({entries: `${_paths.srcDir}${_paths.srcFile}`, debug: true})
		.plugin(_pathmodify, {
			mods: [_pathmodify.mod.dir('app', process.cwd() + '/src/js')]
		})
		.transform('babelify', {presets: ['es2015']})
		.bundle()
		.pipe(_vinylSourceStream(_paths.distFile))
		.pipe(_vinylBuffer())
		.pipe(_sourcemaps.init())
		.pipe(_sourcemaps.write('.'))
		.pipe(_gulp.dest(_paths.distDir))
		.pipe(_utils.browserSync.stream({match: '**/*.js'}));
	},

	dist: () => { return _browserify({entries: `${_paths.srcDir}${_paths.srcFile}`, debug: false})
		.plugin(_pathmodify, {
			mods: [_pathmodify.mod.dir('app', process.cwd() + '/src/js')]
		})
		.transform('babelify', {presets: ['es2015']})
		.bundle()
		.pipe(_vinylSourceStream(_paths.distFile))
		.pipe(_vinylBuffer())
		.pipe(_sourcemaps.init())
		.pipe(_uglify())
		.pipe(_sourcemaps.write('.'))
		.pipe(_gulp.dest(_paths.distDir))
		.pipe(_utils.browserSync.stream({match: '**/*.js'}));
	}
};

const _tasks = {
	dev: 'js:dev',
	dist: 'js:dist'
};

_gulp.task(_tasks.dev, _compile.dev);
_gulp.task(_tasks.dist, _compile.dist);

module.exports = {
	tasks: _tasks,
	compile: _compile,
	paths: _paths
};
