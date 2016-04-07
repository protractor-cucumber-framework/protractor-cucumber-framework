#!/usr/bin/env node

/* eslint quotes: 0 */

let {expect} = require('chai');
let fs = require('fs');
let glob = require('glob');

let Executor = require('./test_util').Executor;
let executor = new Executor();

testSuccessfulFeatures();
testFailingFeatures();
testFailFastFastOption();
testStrictOption();
testMultipleNames();
testUndefinedWithoutStrictOption();
testMultiCapsOverrideBaseOptsAndCliOpts();
testCucumber2();
testCucumber2Tags();
testCucumber2TagsPassedAsBoolean();
testShardedLogFiles();

executor.execute();

function testSuccessfulFeatures() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber1Conf.js'))
    .expectExitCode(0)
    .expectOutput('2 scenarios (2 passed)');
}

function testFailingFeatures() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber1Conf.js --cucumberOpts.tags @failing'))
    .expectExitCode(1)
    .expectErrors([
      { message:"expected 'My AngularJS App' to equal 'Failing scenario 1'" },
      { message:"expected 'My AngularJS App' to equal 'Failing scenario 2'" }
    ]);
}

function testFailFastFastOption() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber1Conf.js --cucumberOpts.tags @failing --cucumberOpts.fail-fast'))
   .expectExitCode(1)
   .expectErrors([{ message: "expected 'My AngularJS App' to equal 'Failing scenario 1'" }]);
}

function testStrictOption() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber1Conf.js --cucumberOpts.tags @strict --cucumberOpts.strict'))
   .expectExitCode(1)
   .expectErrors([{ message: "Undefined steps are not allowed in strict mode" }]);
}

function testMultipleNames() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber1Conf.js --cucumberOpts.name Running --cucumberOpts.name Wrapping'))
    .expectExitCode(0)
    .expectOutput('2 scenarios (2 passed)');
}

function testUndefinedWithoutStrictOption() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber1Conf.js --cucumberOpts.tags @strict'))
   .expectExitCode(0)
   .expectErrors([]);
}

function testMultiCapsOverrideBaseOptsAndCliOpts() {
  executor.addCommandlineTest(runProtractor('test/cucumber/multiConf.js --cucumberOpts.tags @failing'))
   .expectExitCode(0)
   .expectErrors([]);
}

function testCucumber2() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber2Conf.js'))
    .cucumberVersion2()
    .expectExitCode(0)
    .expectErrors([]);
}

function testCucumber2Tags() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber2Conf.js --cucumberOpts.tags @cucumber2 --cucumberOpts.tags ~@failing'))
    .cucumberVersion2()
    .expectOutput('1 scenario (1 passed)')
    .expectExitCode(0)
    .expectErrors([]);
}

function testShardedLogFiles() {
  let logFilePrefix = 'protractor-cucumber-framework-test';
  let findLogFiles = () => glob.sync(`./${logFilePrefix}*.json`);
  findLogFiles().forEach(fs.unlinkSync);

  executor.addCommandlineTest(runProtractor(`test/cucumber/cucumber1Conf.js --capabilities.shardTestFiles true --cucumberOpts.format json:${logFilePrefix}.json`)).expectExitCode(0).then(function() {
    let logFiles = findLogFiles();
    expect(logFiles).to.have.length(2);
  });
}

function testCucumber2TagsPassedAsBoolean() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber2Conf.js --cucumberOpts.tags --specs **/cucumber2.feature'))
    .cucumberVersion2()
    .expectExitCode(0);
}

function runProtractor(options) {
  return `node node_modules/protractor/bin/protractor ${options}`;
}

