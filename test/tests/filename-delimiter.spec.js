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

    it('should error when filenameDelimiter is not a string', function(done) {
      assert.throws(function() {
        require(taskLoader)({ filenameDelimiter: {} });
      }, Error);
      done();
    });

    it('should error when filenameDelimiter is null', function(done) {
      assert.throws(function() {
        require(taskLoader)({ filenameDelimiter: null });
      }, Error);
      done();
    });

    it('should join filenames using delimiter', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        filenameDelimiter: '-',
        configFile: 'config-file.js'
      });

      gulp.tasks.onlyfn.fn();
      done();
    });
  });
})();
