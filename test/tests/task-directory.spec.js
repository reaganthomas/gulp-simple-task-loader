(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('filenameDelimiter', function() {
    beforeEach(function() {
			delete require.cache[require.resolve(taskLoader)];
			delete require.cache[require.resolve('gulp')];
			gulp = require('gulp');
		});

    it('should error when directory does not exist', function(done) {
      assert.throws(function() {
        require(taskLoader)({ taskDirectory: 'gulp-tasks' });
      }, Error);
      done();
    });

    it('should error when directory is not a directory', function(done) {
      assert.throws(function() {
        require(taskLoader)({ taskDirectory: '.gitignore' });
      }, Error);
      done();
    });

    it('should error when directory is not a string', function(done) {
      assert.throws(function() {
        require(taskLoader)({ taskDirectory: {} });
      }, Error);
      done();
    });

    it('should error when directory is null', function(done) {
      assert.throws(function() {
        require(taskLoader)({ taskDirectory: null });
      }, Error);
      done();
    });

    it('should error when directory is blank', function(done) {
      assert.throws(function() {
        require(taskLoader)({ taskDirectory: '' });
      }, Error);
      done();
    });

    it('should allow ./ paths for task directory', function(done) {
      require(taskLoader)({
        taskDirectory: './test/test-tasks',
        configFile: 'config-file.js'
      });

      assert.equal(Object.keys(gulp.tasks).length, 7);
      done();
    });
  });
})();
