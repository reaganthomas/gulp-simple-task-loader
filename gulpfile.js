'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var bump = require('gulp-bump');

gulp.task('bump', function() {
  gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'bump' ], function() {
  return gulp.src('index.js')
    .pipe(to5())
    .pipe(gulp.dest('./build'));
});