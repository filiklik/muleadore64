var Promise = require('bluebird');
var getPixels = Promise.promisify(require("get-pixels"));
var Buffer = require('buffer').Buffer;
var fs = Promise.promisifyAll(require('fs'));

module.exports = {
  generateFromFile
}

function generateFromFile(filename, width, height) {
  
  return getPixels(filename)
    .then((pixels) => {

      // 1 byte holds 8 pixels
      var pxBuffer = new Buffer((width / 8) * height);

      var pxBufferIndex = 0;
      for (var y = 0; y < height; y += 8) {
        for (var x = 0; x < width; x += 8) {

          // we deal with 8x8 pixel blocks here
          for (var py = 0; py < 8; py++) {
            var output = 0;
            var shift = 7;
            for (var px = 0; px < 8; px++) {
              var r = pixels.get(x + px, y + py, 0);
              var g = pixels.get(x + px, y + py, 1);
              var b = pixels.get(x + px, y + py, 2);
              
              if (r === 255) {
                output |= (1 << shift);
              }
              shift--;
            }
            pxBuffer[pxBufferIndex++] = output;
          }
        }
      }
      return pxBuffer;
    });
}
