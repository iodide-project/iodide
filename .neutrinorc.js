'use strict';

module.exports = {
  use: [
    '@neutrinojs/jest',
    ['@neutrinojs/react', { html: { title: 'Iodide Notebook', appMountId: 'page' } }]
  ]
};
