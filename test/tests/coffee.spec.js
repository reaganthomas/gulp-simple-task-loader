(function() {
  'use strict';

  const assert = require('assert');
  const taskLoader = '../../build/index.js';
  let gulp;

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  describe('coffee tasks', function() {
    beforeEach(function() {
      delete require.cache[require.resolve(taskLoader)];
      delete require.cache[require.resolve('gulp')];
      gulp = require('gulp');
    });

    it('should execute a coffee test', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        filenameDelimiter: '-',
        tasknameDelimiter: ':',
        configFile: 'config-file.js'
      });

      gulp.tasks['coffee:task'].fn();
      done();
    });
  });
})();
