(function() {
  'use strict';

  const assert = require('assert');
  const taskLoader = '../../build/index.js';
  let gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('config', function() {
    beforeEach(function() {
      delete require.cache[require.resolve(taskLoader)];
      delete require.cache[require.resolve('gulp')];
      gulp = require('gulp');
    });

    it('should skip files that are directories', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js'
      });

      assert.equal(Object.keys(gulp.tasks).length, 7);
      assert.equal(gulp.tasks['test-dir'], undefined);
      done();
    });
  });
})();
