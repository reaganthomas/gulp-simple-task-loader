'use strict';

var fs = require('fs');

module.exports = {
  validateOptions: function(options) {
    if(typeof options.taskDirectory !== 'string') {
      throw new Error('Task directory must be a string containing the relative path to a task directory');
    }

    if(typeof options.filenameDelimiter !== 'string') {
      throw new Error('Filename delimiter must be a string');
    }

    if(typeof options.tasknameDelimiter !== 'string') {
      throw new Error('Taskname delimiter must be a string');
    }

    if(typeof options.configFile !== 'string') {
      throw new Error('Config file must be a string containing the relative path to a config file');
    }
  },

  validateTaskDirectory: function(taskDirectory) {
    let dirStat = fs.statSync(taskDirectory);

    if(!dirStat.isDirectory()) {
      throw new Error(taskDirectory + ' is not a directory');
    }
  }
};