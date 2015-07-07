(function() {
  'use strict';

  var assert = require('assert');
  var taskLoader = '../../build/index.js';
  var gulp;
  var log = [];

  // register coffeescript to handle any coffee files
  require('coffee-script/register');

  console.log = function() {
		log.push([].slice.call(arguments));
	};

  describe('params', function() {
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
      assert.equal(log.length, 2);
      assert.equal(log[0], '1');
      assert.equal(log[1], '2');
      done();
    });
  });
})();
