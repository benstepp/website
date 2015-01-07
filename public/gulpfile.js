var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),

	//html
	htmlmin = require('gulp-htmlmin');


module.exports = function(date) {

gulp.task('clean', function () {  
	return gulp.src(['build/index.html'], {read: true})
		.pipe(rimraf());
});

gulp.task('html',['clean'],function() {
	return gulp.src(['public/index.html'])
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(gulp.dest('build'));
});

gulp.start('clean');
gulp.start('html');

};