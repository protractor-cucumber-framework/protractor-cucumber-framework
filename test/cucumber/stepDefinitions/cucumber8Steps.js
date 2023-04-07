const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const { Given, Then } = require('@cucumber/cucumber');

Given('I go on {string}', async function (url) {
    await browser.get(url);
});

Then(/the title should equal "([^"]*)"$/, async function (text) {
    expect(await browser.getTitle()).to.equal(text);
});
