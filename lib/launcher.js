var exports = module.exports = {};

exports.test = function test() {
  console.log('Launcher');
};

//C:\Windows\System32\netstat.exe -an
//C:\Windows\System32\mspaint.exe

exports.Executor = function( cmd, args, options ) {
  var spawn = require('child_process').spawn,
      child;

  args = args || [];
  options = options || {};

  child = spawn( cmd, args, options );

  if ( options.detached ) {
    child.unref();
  } else {
    child.stdout.on( 'data', function (buffer) {
      console.log( 'STDOUT: ' + buffer );
    } );

    child.stderr.on( 'data', function(buffer) {
      console.log('STDERR: ' + buffer );
    });
  }

  //child.on( 'exit', function ( code, signal ) {
  //  console.log( 'EXIT CODE ' + code + ' SIGNAL ' + signal );
  //} );

  child.on( 'close', function ( code, signal ) {
    console.log( 'CLOSE PID ' + child.pid + ' CODE ' + code + ' SIGNAL ' + signal );
  } );
};
