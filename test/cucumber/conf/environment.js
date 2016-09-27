let path = require('path');
let webServerDefaultPort = 8081;

module.exports = {
  framework: 'custom',
  frameworkPath: path.join(__dirname, '..', '..', '..', 'index.js'),
  seleniumAddress: (process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub'),
  specs: [path.join(__dirname, '..', '**', '*.feature')],

  capabilities: {
    browserName: (process.env.TEST_BROWSER_NAME || 'chrome'),
    version: (process.env.TEST_BROWSER_VERSION || 'ANY')
  },

  webServerDefaultPort: webServerDefaultPort,
  interactiveTestPort: 6969,
  baseUrl: `http://${process.env.HTTP_HOST || 'localhost'}:${process.env.HTTP_PORT || webServerDefaultPort}`
};
