'use strict';

module.exports = {
  use: [
    ['@neutrinojs/jest',{
      // setup script for the framework
      setupTestFrameworkScriptFile: '<rootDir>/test/setupTests.js',
    }],
    ['@neutrinojs/react',
      { html: { title: 'Iodide Notebook', appMountId: 'page' } }]
  ]
};
