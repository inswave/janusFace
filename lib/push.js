var exports = module.exports = {};

var socketLinker = {};

exports.register = function register( uuid, ws, options ) {
  var resultMsg;

  if ( socketLinker[uuid] ) {
    resultMsg = 'existed';
  } else {
    socketLinker[uuid] = ws.upgradeReq.headers['sec-websocket-key'];
    resultMsg =  'registered';
  }

  return resultMsg;
};

exports.getConnList = function getConnList() {
  return socketLinker;
};

exports.publish = function publish( uuid, msg, wss, options ) {
  var i,
      resultMsg = '',
      wKey = socketLinker[uuid],
      list = wss.clients;

  if ( options.broadcast ) {
    msg = JSON.parse(msg);
    msg.module = 'push';
    msg.action = 'publish';
    msg.options = { broadcast: true };

    for ( i = 0; i < list.length; i++ ) {
      list[i].send( JSON.stringify(msg) );
    }

    resultMsg = 'broadcast';
  } else {
    if ( wKey ) {
      resultMsg = 'silent';

      for ( i = 0; i < list.length; i++ ) {
        if ( wKey === list[i].upgradeReq.headers['sec-websocket-key'] ) {
          msg = JSON.parse(msg);
          msg.module = 'push';
          msg.action = 'publish';
          list[i].send( JSON.stringify(msg) );
          break;
        }
      }
    } else {
      resultMsg = 'notMatched';
    }
  }

  return resultMsg;
};
