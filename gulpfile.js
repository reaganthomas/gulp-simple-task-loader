'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var bump = require('gulp-bump');
var mocha = require('gulp-mocha');
var exec = require('child_process').exec;

gulp.task('build', function() {
	return gulp.src('index.js')
    .pipe(to5())
    .pipe(gulp.dest('./build'));
});

gulp.task('test', [ 'build' ], function() {
	return gulp.src('./test/**.*.js', { read: false })
		.pipe(mocha({ reporter: 'dot' }));
});

gulp.task('coverage', [ 'build' ], function() {
	exec('istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage')
});

gulp.task('bump', [ 'build', 'test' ], function() {
  return gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'build', 'test', 'bump' ]);