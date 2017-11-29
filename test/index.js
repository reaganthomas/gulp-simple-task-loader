(function() {
  'use strict';

  const fs = require('fs');
  const path = require('path');

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
