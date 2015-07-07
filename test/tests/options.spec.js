(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;

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

      var config = gulp.tasks.config.fn();
      assert.equal(config.filenameDelimiter, '-');
      assert.equal(config.tasknameDelimiter, ':');
      done();
    });
  });
})();
