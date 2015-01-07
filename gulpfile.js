//modules
var gulp = require('gulp'),
	gulpsync = require('gulp-sync')(gulp),
	rimraf = require('gulp-rimraf');

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
		partialsOutdir:'build/killingfloor',

		html:['public/killingfloor/index.html'],
		img:['public/killingfloor/img/**/*'],


		libs:['public/libs/foundation-icon-fonts/foundation-icons.woff']

	},

	riftevents: {
		base:'public/riftevents',
		outdir:'build/riftevents',

		js:['public/riftevents/js/**/*.js',
		'public/libs/angular-ui-router/release/angular-ui-router.min.js',
		'public/libs/hammerjs/hammer.min.js'],

		css:['public/riftevents/scss/style.scss'],
		uncss:['public/riftevents/index.html','public/riftevents/partials/events.html','public/riftevents/partials/settings.html'],
		
		partials:['public/riftevents/partials/*.html'],
		partialsOutdir:'build/riftevents',

		html:['public/riftevents/index.html'],
		img:['public/riftevents/img/**/*.jpg'],

		libs:['public/riftevents/img/sprites.svg']

	},

	riftloot: {
		base:'public/riftloot',
		outdir:'build/riftloot',

		js:['public/riftloot/js/**/*.js',
		'public/libs/angular-foundation/mm-foundation.min.js',
		'public/libs/angular-ui-router/release/angular-ui-router.min.js'],

		css:['public/riftloot/scss/style.scss',
		'public/libs/foundation-icon-fonts/foundation-icons.css'],

		uncss:['/public/riftloot/index.html',
		'/public/riftloot/partials/splash.html',
		'/public/riftloot/partials/location.html'],

		partials:['public/riftloot/partials/*.html'],
		partialsOutdir:'build/riftloot',

		html:['public/riftloot/index.html'],
		img:['public/riftloot/img/**/*'],

		libs:['public/libs/foundation-icon-fonts/foundation-icons.woff']

	},

	index: {
		base:'public',
		outdir:'build',

		js:['public/js/**/*.js',
		'public/libs/angular-bootstrap/ui-bootstrap.min.js'],

		css:['public/scss/style.scss'],

		uncss:[],

		partials:['public/partials/*.html'],
		partialsOutdir:'build/',

		html:['public/index.html'],
		img:['public/img/**/*'],

		libs:['public/libs/font-awesome/fonts/fontawesome-webfont.woff']

	}
};


//path of source files
var paths = {
	libs: ['public/libs/**/*']
};

var date = Date.now();
/*
var Tasks = {

	//PARTIALS
	partials: function() {
		return lazypipe()
		.pipe(htmlmin, {
			collapseWhitespace: true,
			removeComments: true });
		//.pipe(html2js)
		//.pipe(header, '(function() {')
		//.pipe(footer, '})();');
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
			//.pipe(uncss,{html:uncssHtml})
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
		.pipe(pipe(uncssk)())
		.pipe(gulp.dest(outdir));

}

//@task is [html,js,partials,css]
function getBuildStreams(task) {
	//array of streams to merge and return
	var streams = [];

	//for each project in config
	for (var key in config) {

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

	//return the merged streams for this task
	return merge(streams);

}

*/
gulp.task('clean', function () {  
	return gulp.src('build/*', {read: false})
		.pipe(rimraf());
});

gulp.task('riftevents',function() {
	require('./public/riftevents/gulpfile.js')(date);
});

gulp.task('riftloot',function() {
	require('./public/riftloot/gulpfile.js')(date);
});