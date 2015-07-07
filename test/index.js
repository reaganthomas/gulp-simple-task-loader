(function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  function specFile(filename) {
    return filename.indexOf('spec.js') !== -1;
  }

  function requireFile(filename) {
    delete require.cache[require.resolve('./tests/' + filename)];
    require('./tests/' + filename);
  }

  fs.readdirSync(path.join(process.cwd(), 'test/tests'))
    .filter(specFile)
    .forEach(requireFile);
})();
