'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var bump = require('gulp-bump');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('build', function() {
	return gulp.src('index.js')
    .pipe(to5())
    .pipe(gulp.dest('./build'));
});

gulp.task('test', [ 'build' ], function() {
	return gulp.src('./test/**/*.js', { read: false })
		.pipe(mocha({ reporter: 'dot' }));
});

gulp.task('coverage', [ 'build' ], function(cb) {
	gulp.src('./build/index.js')
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function() {
			gulp.src('./test/**/*.js')
				.pipe(mocha({ reporter: 'dot' }))
				.pipe(istanbul.writeReports())
				.on('end', cb);
		});
});

gulp.task('bump', [ 'build', 'test' ], function() {
  return gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'build', 'test', 'bump' ]);