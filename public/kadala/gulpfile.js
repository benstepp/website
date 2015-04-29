var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
	concat = require('gulp-concat'),
	merge = require('merge-stream'),

	browserify = require('browserify'),
	gulpBrowserify = require('gulp-browserify'),
	browserifyShim = require('browserify-shim'),
	watchify = require('watchify'),
	reactify = require('reactify'),

	//html
	htmlmin = require('gulp-htmlmin'),
	htmlreplace = require('gulp-html-replace'),
	//css
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	uncss = require('gulp-uncss'),
	//js
	uglify = require('gulp-uglify'),
	wrap = require('gulp-wrap'),
	//img
	imagemin = require('gulp-imagemin');

module.exports = function(date) {
	gulp.task('browserify', function() {
		var bundler = browserify({
			entries: ['./public/kadala/js/app.jsx'],
			transform: [reactify,browserifyShim],
			debug: true,
			cache:{},
			packageCache: {},
			fullpaths:true
		});

		var watcher = watchify(bundler);

		return watcher
			.on('update', function() {
				console.log('updating js');
				watcher.bundle()
					.pipe(source('./public/kadala/js/bundle.js'))
					.pipe(gulp.dest('./'));
			})
		.bundle()
		.pipe(source('./public/kadala/js/bundle.js'))
		.pipe(gulp.dest('./'));

	});

	gulp.task('clean',function() {
		return gulp.src('build/kadala/*', {read: false})
			.pipe(rimraf());
	});

	gulp.task('js',['clean'], function() {
		var bundle = browserify({
				entries:['./public/kadala/js/app.jsx'],
				debug:false,
				transform:[reactify,browserifyShim]
			}).bundle()
			.pipe(source('app-'+date+'.min.js'))
			.pipe(buffer());

		var d3sim = gulp.src('public/libs/d3sim/build/index.js');

		return merge(bundle,d3sim)
			.pipe(concat('app-'+date+'.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('build/kadala'));
	});

	gulp.task('css',['clean'], function() {
		return gulp.src('public/kadala/scss/style.scss')
			.pipe(sass())
			.pipe(concat('style-'+date+'.min.css'))
			.pipe(minifyCss())
			.pipe(gulp.dest('build/kadala'));
	});

	gulp.task('img',['clean'],function() {
		return gulp.src(['public/kadala/img/**/*.jpg','public/kadala/img/**/*.png'])
			.pipe(imagemin())
			.pipe(gulp.dest('build/kadala/img'));
	});

	gulp.task('html',['clean'],function() {
		return gulp.src(['public/kadala/index.html'])
			.pipe(htmlreplace({
				'css':'style-' +date+'.min.css',
				'js':'app-'+date+'.min.js'
			}))
			.pipe(htmlmin({
				collapseWhitespace:true,
				removeComments:true,
				keepClosingSlash: true
			}))
			.pipe(gulp.dest('build/kadala'));
	});

	gulp.task('libs',['clean'],function() {
		return gulp.src(['public/libs/react/react.min.js'])
			.pipe(gulp.dest('build/kadala/js'));
	});


	//gulp.start('browserify');
	gulp.start('clean');
	gulp.start('html');
	gulp.start('css');
	gulp.start('js');
	gulp.start('img');
	gulp.start('libs');

};