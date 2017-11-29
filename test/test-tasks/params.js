(function() {
  'use strict';

  module.exports = function() {
    return {
      params: [ '1', '2' ],
      fn: function(param, cb) {
        console.log(param);
        cb();
      }
    };
  };
})();
