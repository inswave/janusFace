var iconv = require('iconv-lite');

var exports = module.exports = {};

exports.test = function test() {
  console.log('Launcher');
};

//C:\Windows\System32\netstat.exe -an
//C:\Windows\System32\mspaint.exe

exports.Executor = function( cmd, args, options ) {
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
      console.log('=========================');
      var result = Buffer.concat(buffer);
      if ( options.encoding ) {
        console.log( iconv.decode( result, options.encoding ) );
      } else {
        console.log( result.toString() );
      }
      //console.log( iconv.decode( data, 'CP949' ) );
      console.log('=========================');
    } );

    child.stderr.on( 'data', function(buffer) {
      //console.log('STDERR: ' + buffer );
    });
  }

  //child.on( 'exit', function ( code, signal ) {
  //  console.log( 'EXIT CODE ' + code + ' SIGNAL ' + signal );
  //} );

  child.on( 'close', function ( code, signal ) {
    console.log( 'CLOSE PID ' + child.pid + ' CODE ' + code + ' SIGNAL ' + signal );
  } );
};
