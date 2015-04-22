var gulp = require('gulp'),
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css');

var date = Date.now();

//
//	Projects split into separate gulpfiles
//
gulp.task('riftevents',function() {
	require('./public/riftevents/gulpfile.js')(date);
});

gulp.task('riftloot',function() {
});

gulp.task('killingfloor', function() {
	require('./public/killingfloor/gulpfile.js')(date);
});

gulp.task('index', function() {
	require('./public/gulpfile.js')(date);
});

gulp.task('kadala', function() {
	require('./public/kadala/gulpfile.js')(date);
});

//
//	Build scss while developing
//
gulp.task('dev', function() {
	gulp.watch('./public/kadala/scss/**/*.scss', function() {
		gulp.start('scss');
	});
	gulp.start('kadala');
});

gulp.task('scss', function() {
	return gulp.src('./public/kadala/scss/style.scss')
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest('public/kadala/scss'));
});