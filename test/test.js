#!/usr/bin/env node

/* eslint quotes: 0 */

let {expect} = require('chai');
let fs = require('fs');
let glob = require('glob');

let Executor = require('./test_util').Executor;
let executor = new Executor();

let LOG_FILE_PREFIX = 'protractor-cucumber-framework-test';

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
testNormalLogFiles();
testShardedLogFiles();
testMultiCapabilitiesLogFiles();
testGetMultiCapabilitiesLogFiles();

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

function testNormalLogFiles() {
  executor.addCommandlineTest(runProtractor(`test/cucumber/cucumber1Conf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`))
    .before(cleanupLogFiles)
    .expectExitCode(0)
    .after(function() {
      let logFiles = findLogFiles();
      expect(logFiles).to.have.length(1);
      expect(logFiles[0]).to.match(new RegExp(`${LOG_FILE_PREFIX}\.json`));
    });
}

function testShardedLogFiles() {
  executor.addCommandlineTest(runProtractor(`test/cucumber/cucumber1Conf.js --capabilities.shardTestFiles true --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`))
    .before(cleanupLogFiles)
    .expectExitCode(0)
    .after(() => expect(findLogFiles()).to.have.length(2));
}

function testMultiCapabilitiesLogFiles() {
  executor.addCommandlineTest(runProtractor(`test/cucumber/cucumber1MultiConf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`))
    .before(cleanupLogFiles)
    .expectExitCode(0)
    .after(() => expect(findLogFiles()).to.have.length(2));
}

function testGetMultiCapabilitiesLogFiles() {
  executor.addCommandlineTest(runProtractor(`test/cucumber/cucumber1GetMultiConf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`))
    .before(cleanupLogFiles)
    .expectExitCode(0)
    .after(() => expect(findLogFiles()).to.have.length(2));
}

function testCucumber2TagsPassedAsBoolean() {
  executor.addCommandlineTest(runProtractor('test/cucumber/cucumber2Conf.js --cucumberOpts.tags --specs **/cucumber2.feature'))
    .cucumberVersion2()
    .expectExitCode(0);
}

function runProtractor(options) {
  return `node node_modules/protractor/bin/protractor ${options}`;
}

function cleanupLogFiles() {
  findLogFiles().forEach(fs.unlinkSync);
}

function findLogFiles() {
  return glob.sync(`./${LOG_FILE_PREFIX}*.json`);
}
