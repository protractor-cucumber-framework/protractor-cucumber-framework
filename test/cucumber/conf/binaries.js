const {computeExecutablePath} = require('@puppeteer/browsers');
const {resolve} = require('path');

// Chrome 129 is the last version that correctly supports Selenium 3
// Chrome 130 and later require Selenium 4 for browser.executeScript to correctly resolve WebElement arguments
const chromeVersion = '129';

module.exports = {
  chromeDriver: computeExecutablePath({browser: 'chromedriver', buildId: chromeVersion, cacheDir: resolve(__dirname, '../../../')}),
  chrome: computeExecutablePath({browser: 'chrome', buildId: chromeVersion, cacheDir: resolve(__dirname, '../../../')})
};
