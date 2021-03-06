var iconv = require('iconv-lite');

var exports = module.exports = {};

exports.test = function test() {
  console.log('Launcher');
};

//C:\Windows\System32\netstat.exe -an
//C:\Windows\System32\mspaint.exe

exports.Executor = function( cmd, args, options, callback ) {
  var buffer = [],
      child,
      spawn = require('child_process').spawn;

  args = args || [];
  options = options || {};

  child = spawn( cmd, args, options );

  if ( options.detached ) {
    child.unref();
  } else {
    child.stdout.on( 'data', function (chunk) {
      buffer.push(chunk);
    } );

    child.stdout.on( 'end', function () {
      var result = Buffer.concat(buffer);

      if ( options.encoding ) {
        result = iconv.decode( result, options.encoding );
      } else {
        result = result.toString();
      }

      if ( options.debug ) {
        console.log( result );
      }

      if ( callback ) {
        callback( null, result );
      }
    } );

    child.stderr.on( 'data', function(chunk) {
      console.error( 'STDERR : ' + chunk );
      if ( options.encoding ) {
        chunk = iconv.decode( chunk, options.encoding );
      } else {
        chunk = chunk.toString();
      }

      callback( chunk );

    });
  }

  //child.on( 'exit', function ( code, signal ) {
  //  console.log( 'EXIT CODE ' + code + ' SIGNAL ' + signal );
  //} );

  child.on( 'close', function ( code, signal ) {
    console.log( 'CLOSE PID ' + child.pid + ' CODE ' + code + ' SIGNAL ' + signal );
  } );
};
