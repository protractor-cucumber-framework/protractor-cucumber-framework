let env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  baseUrl: env.baseUrl,
  framework: 'custom',
  frameworkPath: '../../index.js',
  specs: ['**/*.feature'],

  multiCapabilities: [
    env.capabilities,
    env.capabilities
  ],

  cucumberOpts: {
    require: 'stepDefinitions/**/cucumber1Steps.js',
    tags: '@dev'
  }
};
