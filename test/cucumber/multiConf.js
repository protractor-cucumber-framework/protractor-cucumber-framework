let env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  baseUrl: env.baseUrl,
  framework: 'custom',
  frameworkPath: '../../index.js',
  specs: ['**/*.feature'],

  multiCapabilities: [{
    browserName: (process.env.TEST_BROWSER_NAME || 'chrome'),
    version: (process.env.TEST_BROWSER_VERSION || 'ANY'),
    cucumberOpts: {
      tags: '@dev',
      format: 'pretty'
    }
  }],

  cucumberOpts: {
    require: 'stepDefinitions/**/cucumber1Steps.js',
    tags: '@failing',
    format: 'progress',
    'no-source': true
  }
};
