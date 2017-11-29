(function() {
  'use strict';

  const del = require('del');
  const gulp = require('gulp');
  const bump = require('gulp-bump');
  const mocha = require('gulp-mocha');
  const babel = require('gulp-babel');
  const istanbul = require('gulp-istanbul');

  gulp.task('clean', function(cb) {
    del([ 'build/**' ]).then(paths => {
      console.log('Deleted build paths');
      cb();
    });
  });

  gulp.task('build', [ 'clean' ], function() {
    return gulp.src('src/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./build'));
  });

  gulp.task('test', [ 'build' ], function() {
    return gulp.src('./test/**/*.js', { read: false })
      .pipe(mocha({ reporter: 'dot' }));
  });

  gulp.task('coverage', [ 'build' ], function(cb) {
    gulp.src('build/**/*.js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function() {
        gulp.src('./test/**/*.js')
          .pipe(mocha({ reporter: 'spec' }))
          .pipe(istanbul.writeReports())
          .on('end', cb);
      });
  });

  gulp.task('bump', [ 'build', 'test' ], function() {
    return gulp.src('./package.json')
      .pipe(bump())
      .pipe(gulp.dest('./'));
  });

  gulp.task('default', [ 'clean', 'build', 'test', 'bump' ]);
})();
