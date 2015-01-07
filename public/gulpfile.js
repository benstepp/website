var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	concat = require('gulp-concat'),

	//html
	htmlmin = require('gulp-htmlmin'),
	htmlreplace = require('gulp-html-replace'),

	//css
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	uncss = require('gulp-uncss'),

	//js
	uglify = require('gulp-uglify'),
	ngExtend = require('gulp-angular-extender'),

	//partials
	html2js = require('gulp-ng-html2js'),

	//img
	imagemin = require('gulp-imagemin');


module.exports = function(date) {

gulp.task('html',function() {
	return gulp.src(['public/index.html'])
		.pipe(htmlreplace({
			'css':'style-' +date+'.min.css',
			'js':'app-'+date+'.min.js'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(gulp.dest('build'));
});

gulp.start('html');

};