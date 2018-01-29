'use strict';

var fs = require('fs');

var packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'));

module.exports = {
  use: [
    '@neutrinojs/jest',
    '@neutrinojs/react',
    (neutrino) => {
      ['css', 'eot', 'js', 'svg', 'ttf', 'woff', 'woff2'].forEach(function(ext) {
         neutrino.config.output.filename(`[name].${ext}`).chunkFilename(`[name].${ext}`)
       });
      return neutrino;
    }
  ],
  options: {
    output: 'docs/dist/' + packageData.version
  }
};
