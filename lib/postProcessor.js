var _ = require('underscore');

var exports = module.exports = {};

exports.test = function test() {
  console.log('postProcessor');
};

exports.ipconfig = function ipconfig( data, io, options ) {
  var i,
      pickup = false,
      char = '',
      item,
      itemProp = ['설명', '물리적 주소', 'IPv4 주소'],
      result = [],
      line = data.split('\r\n');

  for ( i = 0; i < line.length; i++ ) {
    char = line[i].charAt(0);

    if ( char === ' ' ) {
      var matchedProp = _.find( itemProp, function(prop) {
        return line[i].indexOf(prop) !== -1;
      } );

      if ( matchedProp ) {
        item[matchedProp] = line[i].substring( line[i].indexOf(':') + 1 ).trim();

        if ( matchedProp === itemProp[2] && item[matchedProp].indexOf('(') > -1 ) {
          item[matchedProp] = item[matchedProp].substring( 0, item[matchedProp].indexOf('(') );
        }
      }
    } else {
      if ( line[i].trim() ) {
        if ( item ) {
          result.push(item);
        }
        item = {};
      }
    }
  }

  result.shift();
  if ( options.debug ) {
    console.log( JSON.stringify(result) );
  }

  io.emit( 'push', { cmd: 'ipconfig', result: result } );
};
