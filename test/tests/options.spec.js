(function() {
  'use strict';

  const assert = require('assert');
  const taskLoader = '../../build/index.js';
  let gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('options', function() {
    beforeEach(function() {
      delete require.cache[require.resolve(taskLoader)];
      delete require.cache[require.resolve('gulp')];
      gulp = require('gulp');
    });

    it('overwrites default options', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        filenameDelimiter: '-',
        tasknameDelimiter: ':',
        configFile: 'config-file.js'
      });

      const config = gulp.tasks.config.fn();
      assert.equal(config.filenameDelimiter, '-');
      assert.equal(config.tasknameDelimiter, ':');
      done();
    });
  });
})();
