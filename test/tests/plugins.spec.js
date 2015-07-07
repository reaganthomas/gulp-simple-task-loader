(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('plugins', function() {
    beforeEach(function() {
			delete require.cache[require.resolve(taskLoader)];
			delete require.cache[require.resolve('gulp')];
			gulp = require('gulp');
		});

    it('should error when plugins is not an object', function(done) {
      assert.throws(function() {
        require(taskLoader)({ plugins: '' });
      }, Error);
      done();
    });

    it('should error when plugins is null', function(done) {
      assert.throws(function() {
        require(taskLoader)({ plugins: null });
      }, Error);
      done();
    });

    it('makes plugins available to task', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        plugins: { herp: 'derp' },
        configFile: 'config-file.js'
      });

      var plugins = gulp.tasks.plugins.fn();
      assert.equal(plugins.herp, 'derp');
      done();
    });
  });
})();
