var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	source = require('vinyl-source-stream'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),

	browserify = require('browserify'),
	browserifyShim = require('browserify-shim'),
	watchify = require('watchify'),
	reactify = require('reactify');

module.exports = function(date) {
	gulp.task('browserify', function() {
		var bundler = browserify({
			entries: ['./public/kadala/js/app.jsx'],
			transform: [reactify,browserifyShim],
			debug: true,
			cache:{},
			packageCache: {},
			fullpaths:true
		});

		var watcher = watchify(bundler);

		return watcher
			.on('update', function() {
				console.log('updating js');
				watcher.bundle()
					.pipe(source('./public/kadala/js/bundle.js'))
					.pipe(gulp.dest('./'));
			})
		.bundle()
		.pipe(source('./public/kadala/js/bundle.js'))
		.pipe(gulp.dest('./'));

	});

	gulp.task('clean',function() {
		return gulp.src('build/kadala/*', {read: false})
			.pipe(rimraf());
	});

	gulp.task('js', function() {

	});

	gulp.task('css', function() {

	});

	gulp.task('img',function() {

	});


	gulp.start('browserify');
};