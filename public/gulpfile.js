var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	concat = require('gulp-concat'),

	//html
	htmlmin = require('gulp-htmlmin'),
	htmlreplace = require('gulp-html-replace'),

	//css
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),

	//js
	uglify = require('gulp-uglify'),

	//img
	imagemin = require('gulp-imagemin');


module.exports = function(date) {

gulp.task('clean', function () {  
	return gulp.src(['build/index.html','build/*.css','build/*.js'], {read: true})
		.pipe(rimraf());
});

gulp.task('html',['clean'],function() {
	return gulp.src(['public/index.html'])
		.pipe(htmlreplace({
			'css':'style-' +date+'.min.css',
			'js':'app-'+date+'.min.js'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			keepClosingSlash: true}))
		.pipe(gulp.dest('build'));
});

gulp.task('css',['clean'],function() {
	return gulp.src('public/scss/style.scss')
		.pipe(sass())
		.pipe(concat('style-'+date+'.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('build'));
});

gulp.task('js',['clean'],function() {
	return gulp.src('public/js/*.js')
		.pipe(concat('app-'+date+'.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

gulp.task('img',['clean'],function() {
	return gulp.src('public/img/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('build/img'));
});

gulp.start('clean');
gulp.start('html');
gulp.start('js');
gulp.start('css');
gulp.start('img');

};