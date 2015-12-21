var fs = require('fs'),
  sslOptions = {
    key: fs.readFileSync( __dirname + '/key/w-gear.key'),
    cert: fs.readFileSync( __dirname + '/key/w-gear.crt')
  };

var express = require('express'),
  app = express(),
  https = require('https').Server( sslOptions, app ),
  WebSocket = require('ws'),
  WebSocketServer = WebSocket.Server,
  favicon = require('serve-favicon'),
  util = require('./lib/util'),
  push = require('./lib/push');

app.use( favicon( __dirname + '/public/images/websquare.ico' ) );
app.use( express.static('public') );
app.use( express.static('bower_components') );

app.get( '/**', function( req, res ) {
  if ( req.url === '/' ) {
    res.sendFile( 'index.html' );
  } else {
    res.sendFile( req.url );
  }
});

https.listen( 3111, function() {
  console.log( 'listening on *:3111' );
});

var wss = new WebSocketServer( { server: https } );

(function( library ) {
  wss.on( 'connection', function ( wsConnect ) {
    var lib = library;
    console.log( 'connection' );

    wsConnect.on( 'message', function ( message ) {
      //console.log( message );
      var msg = JSON.parse(message);
      console.log( 'module: ' + msg.module + ' action: ' + msg.action + ' options: ' +
        ( msg.options? JSON.stringify( msg.options ) : '' ) );
      //console.log( lib[msg.module][msg.action]() );

      if ( msg.options ) {
        msg.args = msg.args || [];
        if ( msg.options.useWS ) {
          msg.args.push( wsConnect );
        }
        msg.args.push( msg.options );
      }

      msg.result = lib[msg.module][msg.action].apply( lib[msg.module], msg.args || [] );

      if ( msg.options && msg.options.useWS ) {
        msg.args.splice( msg.args.length - 2, 1 );
      }

      wsConnect.send( JSON.stringify(msg) );
    });
  });
})( { util: util, push: push } );

// Test
var https_test = require('https').Server( sslOptions );

https_test.listen( 3112, function() {
  console.log( 'listening on *:3112' );
});

var wss_test = new WebSocketServer( { server: https_test } );

(function( library ) {
  wss_test.on( 'connection', function ( wsConnect ) {
    var lib = library;
    console.log( 'wss_test connection' );

    wsConnect.on( 'message', function ( message ) {
      var msg = JSON.parse(message);
      console.log( 'module: ' + msg.module + ' action: ' + msg.action + ' options: ' +
        ( msg.options? JSON.stringify( msg.options ) : '' ) );

      if ( msg.options ) {
        msg.args = msg.args || [];
        if ( msg.options.useWS ) {
          msg.args.push( wsConnect );
        } else if ( msg.options.useWSS ) {
          msg.args.push( wss );
        }
        msg.args.push( msg.options );
      }

      msg.result = lib[msg.module][msg.action].apply( lib[msg.module], msg.args || [] );

      if ( msg.options && ( msg.options.useWS || msg.options.useWSS ) ) {
        msg.args.splice( msg.args.length - 2, 1 );
      }

      if ( msg.result !== 'silent' ) {
        wsConnect.send( JSON.stringify(msg) );
      }
    });
  });
})( { util: util, push: push } );
