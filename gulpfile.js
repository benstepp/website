//modules
var gulp = require('gulp'),
	lazypipe = require('lazypipe'),
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
	templateCache = require('gulp-angular-templatecache'),
	merge = require('merge-stream'),
	ngannotate = require('gulp-ng-annotate');

//config
var config = {
	killingfloor: {
		js:['public/killingfloor/js/**/*.js', 
		'public/libs/angular-foundation/mm-foundation.min.js', 
		'public/libs/angular-ui-router/release/angular-ui-router.min.js'],

		css:['public/killingfloor/scss/style.scss',
		'public/libs/foundation-icon-fonts/foundation-icons.css'],

		uncss:['public/killingfloor/index.html', 
		'public/killingfloor/partials/*.html'],

		partials:['public/killingfloor/partials/*.html'],

		html:['public/killingfloor/index.html']
	}
};

//path of source files
var paths = {
	//killingfloor
	kfjs: ['public/killingfloor/js/**/*.js', 
		'public/libs/angular-foundation/mm-foundation.min.js', 
		'public/libs/angular-ui-router/release/angular-ui-router.min.js'
		],
	kfcss: ['public/killingfloor/scss/style.scss',
		'public/libs/foundation-icon-fonts/foundation-icons.css'],
	kfuncss: ['public/killingfloor/index.html', 
		'public/killingfloor/partials/addfriends.html', 
		'public/killingfloor/partials/comparemaps.html', 
		'public/killingfloor/partials/input.html'
	],

	vendor: ['public/libs/socket.io-client/socket.io.js',
		'public/libs/angular-ui-router/release/angular-ui-router.min.js',
		'public/libs/angular-bootstrap/ui-bootstrap.min.js',
		'public/libs/angular-socket-io/socket.min.js',
		'public/libs/angular-bootstrap/ui-bootstrap-tpls.min.js'],
	img: ['public/**/img/**/*', '!public/libs/**/*'],
	css: ['public/**/*.css', '!public/libs/**/*'],
	scss: ['public/**/*.scss', '!public/libs/**/*'],
	html: ['public/**/index.html', '!public/libs/**/*'],
	libs: ['public/libs/**/*']
};

var date = Date.now();

//JS tasks
/**
var jsTasks = lazypipe()
	.pipe(jshint())
	.pipe(concat('app.js'))
	.pipe(uglify({mangle: true}));

var cssTasks = lazypipe()
	.pipe(sass())
	.pipe(concat('style.css'))
	.pipe(minifyCss());

*/


//Lazypipe to minimize html and register into angular module
var partialsTasks = lazypipe()
	//minimize first to avoid new lines and comments being registered
	.pipe(htmlmin, {
		collapseWhitespace: true,
		removeComments: true })
	//register into a template cache module
	.pipe(templateCache);

//Lazy pipe for html
var htmlTasks = lazypipe()
	.pipe(htmlreplace, {
		'css':'style-' +date+'.min.css',
		'js':'app-'+date+'.min.js',
		'vendor':'vendor-'+date+'.min.js'
	})
	.pipe(htmlmin, {
		collapseWhitespace: true,
		removeComments: true });

// @srcfiles is a string or array of files
// @base is the base directory
// @pipe defines the actions to chain for this pipe
// @outdir defines the output directory
function getBuildPipe(src, base, pipe, outdir) {
	return gulp.src(src, {base:base})
		.pipe(pipe())
		.pipe(gulp.dest(outdir));
}


gulp.task('clean', function () {  
	return gulp.src('build/*', {read: false})
		.pipe(rimraf());
});

gulp.task('img', function() {
	return gulp.src(paths.img, {base:'public/'})
		.pipe(imagemin())
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
		.pipe(gulp.dest('build'));
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

gulp.task('kf', function() {
	var base = 'public/';
	var outdir = 'build/';

	var html =  getBuildPipe(config.killingfloor.html, base, htmlTasks, outdir);
	var partials = getBuildPipe(config.killingfloor.html, base, partialsTasks, outdir);


	return merge(html, partials);

});

gulp.task('partials', function() {
	var base = 'public/';
	var outdir = 'public/';

	var streams = [];

	for (var key in config) {
		var partial = getBuildPipe(config[key].partials, base, partialsTasks, outdir);
		streams.push(partial);
	}

	return merge(streams);

});

gulp.task('html', function() {
	var base = 'public/';
	var outdir = 'build/';

	var streams = [];

	for (var key in config) {
		var html = getBuildPipe(config[key].html, base, htmlTasks, outdir);
		streams.push(html);
	}

	return merge(streams);
});


gulp.task('libs', function() {
	return gulp.src(paths.libs,{base:'public/'})
		.pipe(gulp.dest('build'));
});

gulp.task('default', function() {
	gulp.start('img');
	gulp.start('html');
	gulp.start('kfjs');
	gulp.start('kfcss');
	gulp.start('libs');
});

gulp.task('dev2', function() {
	gulp.watch(paths.scss, function() {
		gulp.start('scss');
	});
});

gulp.task('scss', function() {
	return gulp.src(paths.scss, {base:'public/'})
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest('public'));
});