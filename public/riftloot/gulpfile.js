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
	return gulp.src('build/riftloot/*', {read: false})
		.pipe(rimraf());
});

gulp.task('html',['clean'],function() {
	return gulp.src(['public/riftloot/index.html'])
		.pipe(htmlreplace({
			'css':'style-' +date+'.min.css',
			'js':'app-'+date+'.min.js'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(gulp.dest('build/riftloot'));
});

gulp.task('css',['clean'],function() {
	return gulp.src(['public/riftloot/scss/style.scss','public/libs/foundation-icon-fonts/foundation-icons.css'])
		.pipe(sass())
		.pipe(concat('style-'+date+'.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('build/riftloot'));
});

gulp.task('partials',['clean'], function() {
	return gulp.src('public/riftloot/partials/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(html2js({
			moduleName:'templates',
			prefix: 'partials/'
		}))
		.pipe(concat('templates.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/riftloot'));
});

gulp.task('js',['partials'],function() {
	return gulp.src(['public/riftloot/js/**/*.js','build/riftloot/templates.js','public/libs/angular-ui-router/release/angular-ui-router.min.js','public/libs/angular-foundation/mm-foundation.min.js','public/libs/angular-translate/angular-translate.min.js'])
		.pipe(concat('app-'+date+'.min.js'))
		.pipe(ngExtend({app:['templates']}))
		.pipe(uglify())
		.pipe(gulp.dest('build/riftloot'));
});

gulp.task('img',['clean'],function() {
	return gulp.src(['public/riftloot/img/**/*.jpg','public/riftloot/img/**/*.png'])
	.pipe(imagemin())
	.pipe(gulp.dest('build/riftloot/img'));
});

gulp.task('libs',['clean'],function() {
	return gulp.src(['public/libs/foundation-icon-fonts/foundation-icons.woff','public/libs/foundation-icon-fonts/foundation-icons.eot'])
		.pipe(gulp.dest('build/riftloot/'));
});

gulp.task('cleanup',['js'], function() {
	return gulp.src(['build/riftloot/templates.js'])
		.pipe(rimraf());
});

gulp.start('clean');
gulp.start('html');
gulp.start('css');
gulp.start('partials');
gulp.start('js');
gulp.start('img');
gulp.start('libs');
gulp.start('cleanup');

};