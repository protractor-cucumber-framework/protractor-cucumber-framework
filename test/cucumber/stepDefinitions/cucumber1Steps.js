var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function() {
  this.Given(/^I run Cucumber with Protractor$/, function() {
  });

  this.Given(/^I go on(?: the website)? "([^"]*)"$/, async function(url) {
    await browser.get(url);
  });

  this.Then(/^it should still do normal tests$/, function() {
    expect(true).to.equal(true);
  });

  this.Then(/^it should expose the correct global variables$/, function() {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(by).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

  this.Then(/the title should equal "([^"]*)"$/, async function(text) {
    expect(await browser.getTitle())
      .to.equal(text);
  });

  this.When(/an uncaught exception is thrown/, async function() {
    await element(by.css('[nuthin-here]'))
      .getText();
  });
};
