(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('configFile', function() {
    beforeEach(function() {
			delete require.cache[require.resolve(taskLoader)];
			delete require.cache[require.resolve('gulp')];
			gulp = require('gulp');
		});

    it('should error when configFile is not a string', function(done) {
      assert.throws(function() {
        require(taskLoader)({ configFile: {} });
      }, Error);
      done();
    });

    it('should error when configFile is null', function(done) {
      assert.throws(function() {
        require(taskLoader)({ configFile: null });
      }, Error);
      done();
    });

    it('should error when configFile does not exist', function(done) {
      assert.throws(function() {
        require(taskLoader)({
          taskDirectory: 'test/test-tasks',
          configFile: 'derp.js'
        });
      }, Error);
      done();
    });

    it('should error when configFile is not a file', function(done) {
      assert.throws(function() {
        require(taskLoader)({
          taskDirectory: 'test/test-tasks',
          configFile: 'test-dir'
        });
      }, Error);
      done();
    });

    it('should allow ./ paths for config file', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: './config-file.js'
      });

      var config = gulp.tasks.config.fn();
      assert.equal(config.derp, true);
      done();
    });

    it('should pickup config file', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js'
      });

      var config = gulp.tasks.config.fn();
      assert.equal(config.derp, true);
      done();
    });

    it('should not add configFile as task', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js'
      });

      assert.equal(Object.keys(gulp.tasks).length, 7);
      assert.equal(gulp.tasks['config-file'], undefined);
      done();
    });
  });
})();
