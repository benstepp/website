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

gulp.task('clean', function () {  
	return gulp.src('build/killingfloor/*', {read: false})
		.pipe(rimraf());
});

gulp.task('html',['clean'],function() {
	return gulp.src(['public/killingfloor/index.html'])
		.pipe(htmlreplace({
			'css':'style-' +date+'.min.css',
			'js':'app-'+date+'.min.js'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			keepClosingSlash: true}))
		.pipe(gulp.dest('build/killingfloor'));
});

gulp.task('css',['clean'],function() {
	return gulp.src(['public/killingfloor/scss/style.scss','public/libs/foundation-icon-fonts/foundation-icons.css'])
		.pipe(sass())
		.pipe(concat('style-'+date+'.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('build/killingfloor'));
});

gulp.task('partials',['clean'], function() {
	return gulp.src('public/killingfloor/partials/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(html2js({
			moduleName:'templates',
			prefix: 'partials/'
		}))
		.pipe(concat('templates.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/killingfloor'));
});

gulp.task('js',['partials'],function() {
	return gulp.src(['public/killingfloor/js/**/*.js','build/killingfloor/templates.js','public/libs/angular-ui-router/release/angular-ui-router.min.js','public/libs/angular-foundation/mm-foundation.min.js'])
		.pipe(concat('app-'+date+'.min.js'))
		.pipe(ngExtend({app:['templates']}))
		.pipe(uglify())
		.pipe(gulp.dest('build/killingfloor'));
});

gulp.task('img',['clean'],function() {
	return gulp.src(['public/killingfloor/img/**/*.jpg','public/killingfloor/img/**/*.png'])
	.pipe(imagemin())
	.pipe(gulp.dest('build/killingfloor/img'));
});

gulp.task('lib1',['clean'],function() {
	return gulp.src(['public/libs/foundation-icon-fonts/foundation-icons.woff'])
		.pipe(gulp.dest('build/killingfloor/'));
});

gulp.task('lib2',['clean'], function() {
	return gulp.src(['public/libs/angular/angular.min.js'])
		.pipe(gulp.dest('build/killingfloor/js'));
});

gulp.task('cleanup',['js'], function() {
	return gulp.src(['build/killingfloor/templates.js'])
		.pipe(rimraf());
});

gulp.start('clean');
gulp.start('html');
gulp.start('css');
gulp.start('partials');
gulp.start('js');
gulp.start('img');
gulp.start('lib1');
gulp.start('lib2');
gulp.start('cleanup');

};