(function() {
  'use strict';

  var path = require('path');
  var _ = require('lodash');

  var transformer = require('./transformer');
  var validation = require('./validation');
  var processor = require('./processor');

  module.exports = function(options, existingGulp) {
    let gulp = existingGulp || require('gulp');

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

    options.taskDirectory = transformer.transformTaskDirectory(options.taskDirectory);
    options.configFile = transformer.transformConfigFile(options.configFile);

    options.taskDirectory = (path.resolve(options.taskDirectory) === options.taskDirectory) ? options.taskDirectory : path.join(path.resolve('.'), options.taskDirectory);
    validation.validateTaskDirectory(options.taskDirectory);

    options.configFile = (options.configFile) ? path.join(options.taskDirectory, options.configFile) : null;
    validation.validateConfigFile(options.configFile);

    if(options.configFile) {
      options.config = _.assign(options.config, require(options.configFile));
    }

    processor.processTaskDirectory(options, gulp);
  };
})();
