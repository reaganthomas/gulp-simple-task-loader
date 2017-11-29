(function () {
  'use strict';

  const fs = require('fs');

  const taskDirectoryErrorString = 'Task directory must be a string containing the relative path to a task directory';
  const filenameDelimiterErrorString = 'Filename delimiter must be a string';
  const tasknameDelimiterErrorString = 'Taskname delimiter must be a string';
  const configFileErrorString = 'Config file must be a string containing the relative path to a config file';
  const configErrorString = 'Config must be an object containing configuration options for your gulp tasks';
  const pluginsErrorString = 'Plugins must be an object containing plugins you wish to use in your gulp tasks';

  function validateOption(option, type, required, errorString) {
    switch (type) {
      case 'string':
        if (typeof option !== type || required && option.length === 0) {
          throw new Error(errorString);
        }
        break;
      case 'object':
        if (!option || typeof option !== type) {
          throw new Error(errorString);
        }
        break;
    }
  }

  module.exports = {
    validateOptions: function (options) {
      validateOption(options.taskDirectory, 'string', true, taskDirectoryErrorString);
      validateOption(options.filenameDelimiter, 'string', false, filenameDelimiterErrorString);
      validateOption(options.tasknameDelimiter, 'string', false, tasknameDelimiterErrorString);
      validateOption(options.configFile, 'string', false, configFileErrorString);
      validateOption(options.config, 'object', false, configErrorString);
      validateOption(options.plugins, 'object', false, pluginsErrorString);
    },

    validateTaskDirectory: function (taskDirectory) {
      let dirStat = fs.statSync(taskDirectory);

      if (!dirStat.isDirectory()) {
        throw new Error(taskDirectory + ' is not a directory');
      }
    },

    validateConfigFile: function (configFile) {
      if (!configFile) {
        return;
      }

      let fileStat = fs.statSync(configFile);

      if (!fileStat.isFile()) {
        throw new Error(configFile + ' is not a file');
      }
    }
  };
})();