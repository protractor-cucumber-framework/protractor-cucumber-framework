const chromeOptions = require('./chromeOptions.js');
const env = require('./environment.js');

exports.config = Object.assign({}, env, {
  capabilities: false,

  multiCapabilities: [
    {
      browserName: process.env.TEST_BROWSER_NAME || 'chrome',
      version: process.env.TEST_BROWSER_VERSION || 'ANY',
      cucumberOpts: {
        tags: '@dev',
        format: 'pretty',
      },

      chromeOptions,
    },
  ],

  cucumberOpts: {
    require: `${__dirname}/../stepDefinitions/**/cucumber1Steps.js`,
    tags: '@failing',
    format: 'progress',
    'no-source': true,
  },
});
