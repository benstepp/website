//modules
var gulp = require('gulp'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	htmlmin = require('gulp-htmlmin'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	ngannotate = require('gulp-ng-annotate');

//path of source files
var paths = {
	js: ['public/js/**/*.js', '!public/libs/**/*'],
	img: ['public/img/**/*', '!public/libs/**/*'],
	css: ['public/**/*.css', '!public/libs/**/*'],
	html: ['public/**/*.html', '!public/libs/**/*'],
	libs: ['public/libs/**/*']
};


gulp.task('css', function() {
	return gulp.src(paths.css, {base:'public/'})
		.pipe(minifyCss())
		.pipe(rename(function(path){
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('img', function() {
	return gulp.src(paths.img, {base:'public/'})
		.pipe(imagemin())
		.pipe(gulp.dest('build'));
});

gulp.task('html', function() {
	return gulp.src(paths.html, {base:'public/'})
		.pipe(htmlmin(
			{
				collapseWhitespace: true,
				removeComments: true
			}
		))
		.pipe(gulp.dest('build'));
});

gulp.task('js', function() {
	return gulp.src(paths.js, {base:'public/'})
		.pipe(jshint())
		.pipe(concat('app.js'))
		.pipe(uglify({mangle: false}))
		.pipe(rename(function(path){
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('libs', function() {
	return gulp.src(paths.libs,{base:'public/'})
		.pipe(gulp.dest('build'));
});

gulp.task('default', function() {
	gulp.start('css');
	gulp.start('img');
	gulp.start('html');
	gulp.start('js');
	gulp.start('libs');
});