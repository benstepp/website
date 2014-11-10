//modules
var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	rimraf = require('gulp-rimraf'),
	lazypipe = require('lazypipe'),
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
	html2js = require('gulp-html2js'),
	merge = require('merge-stream'),
	ngannotate = require('gulp-ng-annotate'),
	header = require('gulp-header'),
	footer = require('gulp-footer');

//config
var config = {
	killingfloor: {
		base:'public/killingfloor',
		outdir:'build/killingfloor',

		js:['public/killingfloor/js/**/*.js', 
		'public/libs/angular-foundation/mm-foundation.min.js', 
		'public/libs/angular-ui-router/release/angular-ui-router.min.js'],

		css:['public/killingfloor/scss/style.scss',
		'public/libs/foundation-icon-fonts/foundation-icons.css'],
		uncss:['public/killingfloor/index.html', 
		'public/killingfloor/partials/addfriends.html',
		'public/killingfloor/partials/comparemaps.html',
		'public/killingfloor/partials/input.html'],

		partials:['public/killingfloor/partials/*.html'],
		//partialsOutdir:'public/killingfloor/js/',
		partialsOutdir:'build/killingfloor',

		html:['public/killingfloor/index.html'],
		img:['public/killingfloor/img/**/*'],


		libs:['public/libs/foundation-icon-fonts/foundation-icons.woff']

	},

	/*riftevents: {
		base:'public/riftevents',
		outdir:'build/riftevents',

		css:['public/riftevents/scss/style.scss',
		'public/riftevents/scss/*.scss',
		'public/libs/foundation-icon-fonts/foundation-icons.css'],
	},*/

	riftloot: {
		base:'public/riftloot',
		outdir:'build/riftloot',

		js:['public/riftloot/js/**/*.js',
		'public/libs/angular-foundation/mm-foundation.min.js',
		'public/libs/angular-ui-router/release/angular-ui-router.min.js'],

		css:['public/riftloot/scss/style.scss',
		'public/libs/foundation-icon-fonts/foundation-icons.css'],

		uncss:['public/riftloot/index.html',
		'public/riftloot/partials/splash.html',
		'public/riftloot/partials/location.html'],

		partials:['public/riftloot/partials/*.html'],
		partialsOutdir:'build/riftloot',

		html:['public/riftloot/index.html'],
		img:['public/riftloot/img/**/*'],

		libs:['public/libs/foundation-icon-fonts/foundation-icons.woff']

	},

	//total fucking hack because i cant pass arguments to a lazypipe
	//also errors fucking everywhere but at least it runs
	false: {
		uncss:['!public/']
	}
};


//path of source files
var paths = {
	libs: ['public/libs/**/*']
};

var date = Date.now();

var Tasks = {

	//PARTIALS
	partials: function() {
		return lazypipe()
		.pipe(htmlmin, {
			collapseWhitespace: true,
			removeComments: true })
		.pipe(html2js)
		.pipe(header, '(function() {')
		.pipe(footer, '})();');
	},

	//HTML
	html: function() {
		return lazypipe()
			.pipe(htmlreplace, {
				'css':'style-' +date+'.min.css',
				'js':'app-'+date+'.min.js',
				'vendor':'vendor-'+date+'.min.js'
			})
			.pipe(htmlmin, {
				collapseWhitespace: true,
				removeComments: true });
		},

	//CSS
	css: function(uncssHtml) {
		return lazypipe()
			.pipe(sass)
			.pipe(concat,'style.css')
			.pipe(minifyCss)
			.pipe(rename, function(path){
				path.basename += '-' + date + '.min';
			});
	},

	//IMG
	img: function() {
		return lazypipe()
				.pipe(imagemin);
	},

	//JS
	js: function() {
		return lazypipe()
		.pipe(jshint)
		.pipe(concat, 'app.js')
		.pipe(uglify, {magnle:true})
		.pipe(rename, function(path){
			path.basename += '-' + date +'.min';
		});
	},

	//LIBS
	libs: function() {
		return lazypipe()
			.pipe(rename, function(path) {
				path.dirname = './';
			});
	}

};


// @srcfiles is a string or array of files
// @base is the base directory
// @pipe defines the actions to chain for this pipe
// @outdir defines the output directory
// @uncssk false or the key of project from config json
function getBuildPipe(src, base, pipe, outdir, uncssk) {

	return gulp.src(src, {base:base})
		.pipe(pipe())
		/*
		.pipe(gulpif(uncssk !== false, uncss({
			html: config[uncssk].uncss
		})))
		.pipe(gulpif(uncssk !== false, minifyCss()))
		*/
		.pipe(gulp.dest(outdir));

}

//@task is [html,js,partials,css]
function getBuildStreams(task) {
	//array of streams to merge and return
	var streams = [];

	//for each project in config
	for (var key in config) {
		//false hack because fuck this shit
		if (key !== 'false') {
			var outdir = config[key].outdir;
			//the outdir is different when doing angular templates
			if (task === 'partials') {
				outdir = config[key].partialsOutdir;
			}

			var uncss = false;
			//if task is css set key to uncss
			if (task === 'css') {
				uncss = key;
			}

			//get the stream and push into array
			var stream = getBuildPipe(config[key][task], config[key].base, Tasks[task], outdir, uncss);
			streams.push(stream);
		}
	}

	//return the merged streams for this task
	return merge(streams);

}


gulp.task('clean', function () {  
	return gulp.src('build/*', {read: false})
		.pipe(rimraf());
});

//something something don't repeat yourself going on up in here

gulp.task('img', ['clean'], function() {
	return getBuildStreams('img');
});

gulp.task('partials', ['clean'], function() {
	return getBuildStreams('partials');
});

gulp.task('html', ['clean'], function() {
	return getBuildStreams('html');
});

gulp.task ('css', ['clean'], function() {
	return getBuildStreams('css');
});

gulp.task('js', ['clean', 'partials'], function() {
	return getBuildStreams('js');
});

gulp.task('libs', ['clean'], function() {
	return getBuildStreams('libs');
});

gulp.task('default', function() {
	gulp.start('clean');
	gulp.start('img');
	gulp.start('partials');
	gulp.start('html');
	gulp.start('css');
	gulp.start('js');
	gulp.start('libs');
});


//dev shit ill clean up later
gulp.task('dev2', function() {
	gulp.watch(config.riftloot.css, function() {
		gulp.start('scss');
	});
});

gulp.task('scss', function() {
	return gulp.src(config.riftloot.css, {base:'public/riftloot'})
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest('public/riftloot'));
});