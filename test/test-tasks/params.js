'use strict';

module.exports = function(gulp, config, plugins) {
  return {
    params: [ '1', '2' ],
    fn: function(params, cb) {
      console.log(params);
      cb();
    }
  };
};