var env = require('./environment.js');

exports.config = {
  baseUrl: env.baseUrl,
  seleniumAddress: env.seleniumAddress,
  framework: 'custom',
  frameworkPath: '../index.js',
  capabilities: env.capabilities,
  specs: ['cucumber/*.feature'],

  cucumberOpts: {
    require: 'cucumber/**/stepDefinitionsV2.js',
    tags: '@cucumber2',
    strict: true
  }
};
