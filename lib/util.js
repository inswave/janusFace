var uuid = require('node-uuid');

var exports = module.exports = {};

exports.getUUID = function getUUID( type, options ) {
  type = type || 'v1';
  options = options || {};

  return uuid[type]( options );
};
