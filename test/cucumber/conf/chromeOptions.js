const {chrome} = require('./binaries');

module.exports = {
  w3c: false,
  binary: chrome,
  excludeSwitches: ['enable-automation'],
  args: [
    '--no-sandbox',
    '--disable-infobars',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--log-level=3',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--headless',
  ],
};
