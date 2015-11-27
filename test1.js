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
    favicon = require('serve-favicon');

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

https.listen( 3103, function() {
  console.log( 'listening on *:3103' );
});

var wss = new WebSocketServer( { server: https } );

wss.on( 'connection', function ( wsConnect ) {
  console.log( 'connection' );

  wsConnect.on( 'message', function ( message ) {
    console.log( message );
  });
});
