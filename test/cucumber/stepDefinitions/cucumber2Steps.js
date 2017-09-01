var path = require('path');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var {defineSupportCode} = require(path.join(
  __dirname,
  '..',
  '..',
  '..',
  'lib',
  'cucumberLoader'
)).load();

defineSupportCode(({After, Given, Then, When}) => {
  After((scenario, done) => done());

  Given(/^I go on(?: the website)? "([^"]*)"$/, function(url) {
    return browser.get(url);
  });

  Given(/^I go on(?: the website)? ([^"]*)$/, function(url) {
    return browser.get(url);
  });

  Then(/the title should equal "([^"]*)"$/, function(text) {
    return expect(browser.getTitle()).to.eventually.equal(text);
  });

  When(/an uncaught exception is thrown/, function(done) {
    element(by.css('[nuthin-here]')).getText().then(done);
  });
});
