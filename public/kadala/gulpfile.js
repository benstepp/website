var gulp = require('gulp'),
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
				watcher.bundle()
					.pipe(source('./public/kadala/js/bundle.js'))
					.pipe(gulp.dest('./'));
			})
		.bundle()
		.pipe(source('./public/kadala/js/bundle.js'))
		.pipe(gulp.dest('./'));

	});

	gulp.start('browserify');
};