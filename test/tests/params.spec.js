(function() {
  'use strict';

  const assert = require('assert');
  const taskLoader = '../../build/index.js';

  let gulp;
  let log = [];

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  const oldConsoleLog = console.log;

  describe('params', function() {
    before(function() {
      console.log = function() {
        log.push([].slice.call(arguments));
      };
    });

    after(function() {
      console.log = oldConsoleLog;
    });

    beforeEach(function() {
      log = [];
      delete require.cache[require.resolve(taskLoader)];
      delete require.cache[require.resolve('gulp')];
      gulp = require('gulp');
    });

    it('should parameterize a task', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        configFile: 'config-file.js'
      });

      gulp.tasks.params.fn();

      assert.equal(log.length, 2, 'Log length is incorrect');
      assert.equal(log[0], '1', 'First log entry is incorrect');
      assert.equal(log[1], '2', 'Second log entry is incorrect');

      done();
    });
  });
})();
