(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('tasknameDelimiter', function() {
    beforeEach(function() {
			delete require.cache[require.resolve(taskLoader)];
			delete require.cache[require.resolve('gulp')];
			gulp = require('gulp');
		});

    it('should error when tasknameDelimiter is not a string', function(done) {
      assert.throws(function() {
        require(taskLoader)({ tasknameDelimiter: {} });
      }, Error);
      done();
    });

    it('should error when tasknameDelimiter is null', function(done) {
      assert.throws(function() {
        require(taskLoader)({ tasknameDelimiter: null });
      }, Error);
      done();
    });

    it('should join tasknames using delimiter', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        tasknameDelimiter: ':',
        configFile: 'config-file.js'
      });

      gulp.tasks['o:n:l:y:-:d:e:p:s'].fn();
      done();
    });
  });
})();
