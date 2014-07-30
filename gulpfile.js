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
	vendor: ['public/libs/socket.io-client/socket.io.js',
		'public/libs/angular-ui-router/release/angular-ui-router.min.js',
		'public/libs/angular-bootstrap/ui-bootstrap.min.js',
		'public/libs/angular-socket-io/socket.min.js'],
	img: ['public/img/**/*', '!public/libs/**/*'],
	css: ['public/**/*.css', '!public/libs/**/*'],
	html: ['public/**/*.html', '!public/libs/**/*'],
	libs: ['public/libs/**/*']
};


gulp.task('css', function() {
	return gulp.src(paths.css, {base:'public/'})
		.pipe(minifyCss())
		.pipe(concat('style.css'))
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
		.pipe(uglify({mangle: true}))
		.pipe(rename(function(path){
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('vendor', function() {
	return gulp.src(paths.vendor, {base:'public/'})
		.pipe(concat('vendor.js'))
		.pipe(uglify({mangle: true}))
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
	gulp.start('vendor');
	gulp.start('libs');
});

gulp.task('watch', function() {
	gulp.start('default');
	gulp.watch(paths.js, function() {
		gulp.start('js');
	});
	gulp.watch(paths.css, function() {
		gulp.start('css');
	});
	gulp.watch(paths.html, function() {
		gulp.start('html');
	});
});