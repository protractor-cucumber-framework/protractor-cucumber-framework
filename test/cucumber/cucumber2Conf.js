let env = require('./environment.js');

exports.config = {
  baseUrl: env.baseUrl,
  seleniumAddress: env.seleniumAddress,
  framework: 'custom',
  frameworkPath: '../../index.js',
  capabilities: env.capabilities,
  specs: ['**/*.feature'],

  cucumberOpts: {
    require: 'stepDefinitions/**/cucumber2Steps.js',
    tags: '@cucumber2',
    strict: true
  }
};
