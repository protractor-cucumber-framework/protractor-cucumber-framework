const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const {Given, Then} = require(path.join(
  __dirname,
  '..',
  '..',
  '..',
  'lib',
  'cucumberLoader'
)).load();

Given('I go on {string}', function(url) {
  return browser.get(url);
});

Then(/the title should equal "([^"]*)"$/, function(text) {
  return expect(browser.getTitle()).to.eventually.equal(text);
});
