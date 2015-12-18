var exports = module.exports = {};

var socketLinker = {};

exports.register = function register( uuid, ws, options ) {
  socketLinker[uuid] = ws.upgradeReq.client.server.sessionIdContext;

  return 'registered';
};
