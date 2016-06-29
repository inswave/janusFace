var fs = require('fs'),
    sslOptions = {
      // key: fs.readFileSync( __dirname + '/key/w-gear.key'),
      // cert: fs.readFileSync( __dirname + '/key/w-gear.crt')
      key: fs.readFileSync( __dirname + '/key/wgear.key'),
      cert: fs.readFileSync( __dirname + '/key/wgear_io.crt')
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

wss.on( 'connection', function ( ws ) {
  console.log( 'connection' );

  ws.on( 'message', function ( message ) {
    console.log( message );
    var bitmap = fs.readFileSync( __dirname + '/public/images/splash.bmp' );

    if ( message === 'getBase64' ) {
      // console.log( new Buffer(bitmap).toString('base64') );
      ws.send( new Buffer(bitmap).toString('base64') );
    } else if ( message === 'getBinary' ) {
      // var r = fs.createReadStream( __dirname + '/public/images/splash.bmp' );
      // var w = fs.createWriteStream( __dirname + '/public/images/splash.copy.bmp' );
      // r.pipe(w);
      ws.send( bitmap, { binary: true } );
    }
  });
});
