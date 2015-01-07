var gulp = require('gulp');

var date = Date.now();

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