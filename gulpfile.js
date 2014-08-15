//modules
var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	htmlmin = require('gulp-htmlmin'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	htmlreplace = require('gulp-html-replace'),
	sass = require('gulp-sass'),
	uncss = require('gulp-uncss'),
	ngannotate = require('gulp-ng-annotate');

//path of source files
var paths = {
	kfjs: ['public/killingfloor/js/**/*.js', 'public/libs/angular-foundation/mm-foundation.min.js', 'public/libs/angular-ui-router/release/angular-ui-router.min.js'],
	kfcss: ['public/killingfloor/scss/**/*.scss'],
	kfuncss: ['public/killingfloor/index.html', 'public/killingfloor/partials/addfriends.html', 'public/killingfloor/partials/comparemaps.html', 'public/killingfloor/partials/input.html'],
	vendor: ['public/libs/socket.io-client/socket.io.js',
		'public/libs/angular-ui-router/release/angular-ui-router.min.js',
		'public/libs/angular-bootstrap/ui-bootstrap.min.js',
		'public/libs/angular-socket-io/socket.min.js',
		'public/libs/angular-bootstrap/ui-bootstrap-tpls.min.js'],
	img: ['public/**/img/**/*', '!public/libs/**/*'],
	css: ['public/**/*.css', '!public/libs/**/*'],
	scss: ['public/**/*.scss', '!public/libs/**/*'],
	html: ['public/**/*.html', '!public/libs/**/*'],
	libs: ['public/libs/**/*']
};

var date = Date.now();

gulp.task('clean', function () {  
	return gulp.src('build/*', {read: false})
		.pipe(rimraf());
});

gulp.task('css', function() {
	return gulp.src(paths.css, {base:'public/**/'})
		.pipe(minifyCss())
		.pipe(concat('style.css'))
		.pipe(rename(function(path){
			path.basename += '-' + date + '.min';
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
		.pipe(htmlreplace({
			'css':'style-' +date+'.min.css',
			'js':'app-'+date+'.min.js',
			'vendor':'vendor-'+date+'.min.js'
		}))
		.pipe(htmlmin(
			{
				collapseWhitespace: true,
				removeComments: true
			}
		))
		.pipe(gulp.dest('build'));
});

gulp.task('kfjs', function() {
	return gulp.src(paths.kfjs, {base:'public/'})
		.pipe(jshint())
		.pipe(concat('app.js'))
		.pipe(uglify({mangle: true}))
		.pipe(rename(function(path){
			path.dirname += '/killingfloor/';
			path.basename += '-' + date +'.min';
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('kfcss', function() {
	return gulp.src(paths.kfcss, {base:'public/'})
		.pipe(sass())
		.pipe(concat('style.css'))
		.pipe(uncss({
			html: paths.kfuncss
		}))
		.pipe(minifyCss())
		.pipe(rename(function(path){
			path.dirname += '/killingfloor/';
			path.basename += '-' + date + '.min';
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('vendor', function() {
	return gulp.src(paths.vendor, {base:'public/'})
		.pipe(concat('vendor.js'))
		.pipe(uglify({mangle: true}))
		.pipe(rename(function(path){
			path.basename += '-' + date + '.min';
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('libs', function() {
	return gulp.src(paths.libs,{base:'public/'})
		.pipe(gulp.dest('build'));
});

gulp.task('scss', function() {
	return gulp.src(paths.scss, {base:'public/'})
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest('public'));
});

gulp.task('default', function() {
	gulp.start('css');
	gulp.start('img');
	gulp.start('html');
	gulp.start('kfjs');
	gulp.start('vendor');
	gulp.start('libs');
});



gulp.task('dev2', function() {
	gulp.watch(paths.scss, function() {
		gulp.start('scss');
	});
});