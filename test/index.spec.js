'use strict';

var assert = require('assert');
var taskLoader = '../build/index.js';
var gulp;
var log = [];

// register coffeescript to handle any coffee files
require('coffee-script/register');

console.log = function() {
	log.push([].slice.call(arguments));
};

describe('gulp-simple-task-loader', function() {
	beforeEach(function() {
		log = [];
		delete require.cache[require.resolve(taskLoader)];
		delete require.cache[require.resolve('gulp')];
		gulp = require('gulp');
	});

	describe('edge cases', function() {
		describe('task directory errors', function() {
			it('should error when directory does not exist', function(done) {
				assert.throws(function() {
					require(taskLoader)({ taskDirectory: 'gulp-tasks' });
				}, Error);
				done();
			});

			it('should error when directory is not a directory', function(done) {
				assert.throws(function() {
					require(taskLoader)({ taskDirectory: '.gitignore' });
				}, Error);
				done();
			});

			it('should error when directory is not a string', function(done) {
				assert.throws(function() {
					require(taskLoader)({ taskDirectory: {} });
				}, Error);
				done();
			});

			it('should error when tasknameDelimiter is not a string', function(done) {
				assert.throws(function() {
					require(taskLoader)({ tasknameDelimiter: {} });
				}, Error);
				done();
			});

			it('should error when filenameDelimiter is not a string', function(done) {
				assert.throws(function() {
					require(taskLoader)({ filenameDelimiter: {} });
				}, Error);
				done();
			});

			it('should error when configFile is not a string', function(done) {
				assert.throws(function() {
					require(taskLoader)({ configFile: {} });
				}, Error);
				done();
			});

			it('should error when config is not an object', function(done) {
				assert.throws(function() {
					require(taskLoader)({ config: '' });
				}, Error);
				done();
			});

			it('should error when plugins is not an object', function(done) {
				assert.throws(function() {
					require(taskLoader)({ plugins: '' });
				}, Error);
				done();
			});

			it('should skip files that are directories', function(done) {
				require(taskLoader)({
					taskDirectory: 'test/test-tasks',
					filenameDelimiter: '-',
					tasknameDelimiter: ':'
				});

				assert.equal(Object.keys(gulp.tasks).length, 7);
				done();
			});

			it('should allow ./ paths', function(done) {
				require(taskLoader)({ taskDirectory: './test/test-tasks' });

				assert.equal(Object.keys(gulp.tasks).length, 7);
				done();
			});

		});
	});

	describe('functions', function() {
		it('should execute functions for test coverage', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				filenameDelimiter: '-',
				tasknameDelimiter: ':'
			});

			gulp.tasks['only:deps'].fn();
			gulp.tasks['only:fn'].fn();
			done();
		});

    it('should exeute functions for coffee tests', function(done) {
      require(taskLoader)({
        taskDirectory: 'test/test-tasks',
        plugins: { derp: 'herp' },
        filenameDelimiter: '-',
        tasknameDelimiter: ':'
      });

      gulp.tasks['coffee:task'].fn();
      done();
    });
	});

	describe('params', function() {
		it('should parameterize a task', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				filenameDelimiter: '-',
				tasknameDelimiter: ':'
			});

			gulp.tasks.params.fn();

			assert.equal(log.length, 2);
			assert.equal(log[0], '1');
			assert.equal(log[1], '2');

			done();
		});
	});

	describe('options', function() {
		it('overwrites default options', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				plugins: { derp: 'herp' },
				filenameDelimiter: '-',
				tasknameDelimiter: ':'
			});

			var config = gulp.tasks.config.fn();
			assert.equal(config.filenameDelimiter, '-');
			assert.equal(config.tasknameDelimiter, ':');
			done();
		});

		it('adds new options', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				herp: 'derp'
			});

			var config = gulp.tasks.config.fn();
			assert.equal(config.herp, 'derp');
			done();
		});
	});

	describe('plugins', function() {
		it('makes plugins available to task', function(done) {
			require(taskLoader)({
				taskDirectory: 'test/test-tasks',
				plugins: { herp: 'derp' }
			});

			var plugins = gulp.tasks.plugins.fn();
			assert.equal(plugins.herp, 'derp');
			done();
		});
	});
});