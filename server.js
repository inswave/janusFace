var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
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
  var launcher = require('./lib/launcher');

  console.log( 'a user connected' );

  socket.on( 'publish', function(msg) {
    console.log( 'publish message: ' + JSON.stringify(msg) );
    io.emit( 'push', msg );
  });

  socket.on( 'launch', function(msg) {
    var isWin = /^win/.test(process.platform ),
        cmd,
        args,
        options = null;

    if ( msg ) {
      console.log( 'launch message: ' + JSON.stringify( msg ) );
    } else {
      msg = {};
      console.log( 'launch message empty.' );
    }

    if ( msg.cmd ) {
      cmd = msg.cmd;
    } else {
      cmd = isWin ? 'netstat.exe' : 'netstat';
      args = ['-an'];
    }

    if ( msg.args ) {
      args = msg.args;
    }

    if ( msg.detached ) {
      options = {};
      options.detached = true;
      options.stdio = 'ignore';
    }

    //launcher.test();
    var executor = new launcher.Executor( cmd, args, options );
  });

  socket.on( 'disconnect', function() {
    console.log( 'user disconnected' );
  });
} );

http.listen( 3101, function() {
  console.log( 'listening on *:3101' );
});
