(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('config', function() {
    beforeEach(function() {
			delete require.cache[require.resolve(taskLoader)];
			delete require.cache[require.resolve('gulp')];
			gulp = require('gulp');
		});

    it('should error when config is not an object', function(done) {
      assert.throws(function() {
        require(taskLoader)({ config: '' });
      }, Error);
      done();
    });

    it('should error when config is null', function(done) {
      assert.throws(function() {
        require(taskLoader)({ config: null });
      }, Error);
      done();
    });

    it('exposes config to task', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js',
        config: { herp: 'derp' }
      });

      var config = gulp.tasks.config.fn();
      assert.equal(config.herp, 'derp');
      done();
    });

    it('adds extra options to config', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js',
        herp: 'derp'
      });

      var config = gulp.tasks.config.fn();
      assert.equal(config.herp, 'derp');
      done();
    });

    it('does not overwrite config options with extra options', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js',
        config: { herp: 'flerp' },
        herp: 'derp'
      });

      var config = gulp.tasks.config.fn();
      assert.equal(config.herp, 'flerp');
      done();
    });
  });
})();
