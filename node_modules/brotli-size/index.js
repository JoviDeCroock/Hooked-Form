'use strict';
var duplexer = require('duplexer');
var iltorb = require('iltorb');
var stream = require('stream');

/**
 * @param {!Buffer|string} str
 * @param {!Object=} opt_params
 */
function brotliSize(str, opt_params) {
  if (typeof str == 'string') {
    str = new Buffer(str, 'utf8');
  }
  return iltorb.compress(str, opt_params).then(function(result) {
    return result.length;
  });
}

module.exports = brotliSize;

/**
 * @param {!Buffer|string} str
 * @param {!Object=} opt_params
 */
brotliSize.sync = function(str, opt_params) {
  if (typeof str == 'string') {
    str = new Buffer(str, 'utf8');
  }
  return iltorb.compressSync(str, opt_params).length;
};


/**
 * @param {!Object=} opt_params
 */
brotliSize.stream = function(opt_params) {
  opt_params = opt_params || {};
  var input = new stream.PassThrough();
  var output = new stream.PassThrough();
  var wrapper = duplexer(input, output);

  var brotliSize = 0;
  var brotli = iltorb.compressStream(opt_params)
    .on('data', function(buf) {
      brotliSize += buf.length;
    })
    .on('error', function() {
      wrapper.brotliSize = 0;
    })
    .on('end', function() {
      wrapper.brotliSize = brotliSize;
      wrapper.emit('brotli-size', brotliSize);
      output.end();
    });

  input.pipe(brotli);
  input.pipe(output, {end: false});

  return wrapper;
};
