'use strict';

var async = require('async');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var validation = require('./validation');
var processor = require('./processor');

module.exports = function(options) {
  let defaultOptions = {
    taskDirectory: 'gulp-tasks',
    plugins: {},
    filenameDelimiter: '',
    tasknameDelimiter: '',
    config: {},
    configFile: ''
  };

  options = _.assign(defaultOptions, options);

  validation.validateOptions(options);

  if(options.taskDirectory.slice(0,2) === '.' + path.sep) {
    options.taskDirectory = options.taskDirectory.slice(2);
  }

  options.taskDirectory = path.join(process.cwd(), options.taskDirectory);

  validation.validateTaskDirectory(options.taskDirectory);

  processor.processTaskDirectory(options, gulp);
};