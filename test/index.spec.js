'use strict';

var assert = require('assert');
var gulp = require('gulp');

var taskLoader = '../build/index.js';

describe('gulp-simple-task-loader', function() {
	beforeEach(function() {
		delete require.cache[require.resolve(taskLoader)];
	});

	describe('edge cases', function() {
		describe('task directory errors', function() {
			it('should error when directory does not exist', function(done) {
				assert.throws(function() {
					require(taskLoader)();
				}, Error);
				done();
			});

			it('should error when directory is not a directory', function(done) {
				assert.throws(function() {
					require(taskLoader)({ taskDirectory: 'index.js' });
				}, Error);
				done();
			});
		});
	});

	describe('options', function() {
		it('overwrites default options', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				plugins: { derp: 'herp' },
				filenameDelimiter: '-',
				taskDelimiter: ':'
			});

			var config = gulp.tasks['config'].fn();
			assert.equal(config.taskDirectory.slice(-15), 'test/test-tasks');
			assert.deepEqual(config.plugins, { derp: 'herp' });
			assert.equal(config.filenameDelimiter, '-');
			assert.equal(config.taskDelimiter, ':');
			done();
		});

		it('adds new options', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				herp: 'derp'
			});

			var config = gulp.tasks['config'].fn();
			assert.equal(config.herp, 'derp');
			done();
		});
	});
});