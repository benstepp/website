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
	return gulp.src(['public/riftevents/index.html'])
		.pipe(htmlreplace({
			'css':'style-' +date+'.min.css',
			'js':'app-'+date+'.min.js'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(gulp.dest('build/riftevents'));
});

gulp.task('css',function() {
	return gulp.src(['public/libs/angular-material/angular-material.min.css','public/riftevents/scss/style.scss'])
		.pipe(sass())
		.pipe(concat('style-'+date+'.min.css'))
		/*
		.pipe(uncss({
			html:['public/riftevents/index.html','public/riftevents/partials/events.html','public/riftevents/partials/settings.html'],
			ignore:['.md-color-palette-definition']
		}))
		*/
		.pipe(minifyCss())
		.pipe(gulp.dest('build/riftevents'));
});

gulp.task('partials', function() {
	return gulp.src('public/riftevents/partials/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true }))
		.pipe(html2js({
			moduleName:'templates',
			prefix: 'partials/'
		}))
		.pipe(concat('templates.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/riftevents'));
});

gulp.task('js',['partials'],function() {
	return gulp.src(['public/riftevents/js/**/*.js','build/riftevents/templates.js','public/libs/angular-ui-router/release/angular-ui-router.min.js','public/libs/hammerjs/hammer.min.js','public/libs/angular-material/angular-material.min.js','public/libs/angular-aria/angular-aria.min.js','public/libs/angular-animate/angular-animate.min.js'])
		.pipe(concat('app-'+date+'.min.js'))
		.pipe(ngExtend({app:['templates']}))
		.pipe(uglify())
		.pipe(gulp.dest('build/riftevents'));
});

gulp.task('img',function() {
	return gulp.src(['public/riftevents/img/**/*.jpg','public/riftevents/img/**/*.png'])
	.pipe(imagemin())
	.pipe(gulp.dest('build/riftevents/img'));
});

gulp.task('svg',function() {
	return gulp.src(['public/riftevents/img/*.svg'])
		.pipe(htmlmin({
			collapseWhitespace:true,
			removeCommentsFromCDATA:true,
			keepClosingSlash:true,
			minifyJS:true
		}))
		.pipe(gulp.dest('build/riftevents/img'));
});

gulp.task('cleanup',['js'], function() {
	return gulp.src(['build/riftevents/templates.js'])
		.pipe(rimraf());
});

gulp.start('html');
gulp.start('css');
gulp.start('partials');
gulp.start('js');
gulp.start('img');
gulp.start('svg');
gulp.start('cleanup');

};