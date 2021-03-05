var path = require('path');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var { defineSupportCode } = require('cucumber');

defineSupportCode(({After, Given, Then, When}) => {
  After((scenario) => {});

  Given(/^I go on(?: the website)? "([^"]*)"$/, async function(url) {
    await browser.get(url);
  });

  Given(/^I go on(?: the website)? ([^"]*)$/, async function(url) {
    await browser.get(url);
  });

  Then(/the title should equal "([^"]*)"$/, async function(text) {
    expect(await browser.getTitle()).to.equal(text);
  });

  When(/an uncaught exception is thrown/, async function() {
    await element(by.css('[nuthin-here]'))
      .getText();
  });
});
