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



var date = Date.now();

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

gulp.task('killingfloor', function() {
	require('./public/killingfloor/gulpfile.js')(date);
});

gulp.task('index', function() {
	require('./public/gulpfile.js')(date);
});