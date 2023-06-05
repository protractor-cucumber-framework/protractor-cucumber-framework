const path = require('path');
const webServerDefaultPort = 8081;
const chromeOptions = require('./chromeOptions');

module.exports = {
  framework: 'custom',
  frameworkPath: path.join(__dirname, '..', '..', '..', 'index.js'),
  ignoreUncaughtExceptions: true,
  specs: [path.join(__dirname, '..', '**', '*.feature')],

  chromeDriver: require(`chromedriver/lib/chromedriver`).path,
  SELENIUM_PROMISE_MANAGER: false,
  directConnect: true,

  capabilities: {
    browserName: process.env.TEST_BROWSER_NAME || 'chrome',
    version: process.env.TEST_BROWSER_VERSION || 'ANY',

    chromeOptions,
  },

  webServerDefaultPort: webServerDefaultPort,
  interactiveTestPort: 6969,
  baseUrl: `http://${process.env.HTTP_HOST || 'localhost'}:${
    process.env.HTTP_PORT || webServerDefaultPort
  }`,
};
