'use strict';

(function () {
  'use strict';

  var path = require('path');

  function removeDotSlash(relativePath) {
    if (relativePath.slice(0, 2) === '.' + path.sep) {
      relativePath = relativePath.slice(2);
    }

    return relativePath;
  }

  module.exports = {
    transformTaskDirectory: function transformTaskDirectory(taskDirectory) {
      return removeDotSlash(taskDirectory);
    },

    transformConfigFile: function transformConfigFile(configFile) {
      configFile = removeDotSlash(configFile);
      return configFile.length !== 0 ? configFile : null;
    }
  };
})();