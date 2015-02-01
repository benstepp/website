var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),

	//html
	htmlmin = require('gulp-htmlmin'),

	//css
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),

	//js
	uglify = require('gulp-uglify'),

	//img
	imagemin = require('gulp-imagemin');


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

gulp.task('css',['clean'],function() {
	return gulp.src()
		.pipe(sass)
		.pipe(gulp.dest('build'));
});

gulp.start('clean');
gulp.start('html');

};