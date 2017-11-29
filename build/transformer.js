(function () {
  'use strict';

  const path = require('path');

  function removeDotSlash(relativePath) {
    if (relativePath.slice(0, 2) === '.' + path.sep) {
      relativePath = relativePath.slice(2);
    }

    return relativePath;
  }

  module.exports = {
    transformTaskDirectory: function (taskDirectory) {
      return removeDotSlash(taskDirectory);
    },

    transformConfigFile: function (configFile) {
      configFile = removeDotSlash(configFile);
      return configFile.length !== 0 ? configFile : null;
    }
  };
})();