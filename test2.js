var fs = require('fs'),
    sslOptions = {
      key: fs.readFileSync( __dirname + '/key/w-gear.key'),
      cert: fs.readFileSync( __dirname + '/key/w-gear.crt')
    };

var express = require('express'),
    app = express(),
    https = require('https').Server( sslOptions, app ),
    io = require('socket.io')(https),
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

io.on( 'connection', function(socket) {
  console.log( 'a user connected' );

  socket.on( 'message', function(message) {
    console.log( message );
  });

  socket.on( 'disconnect', function() {
    console.log( 'user disconnected' );
  });
} );

https.listen( 3104, function() {
  console.log( 'listening on *:3104' );
});
