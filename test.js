#!/usr/bin/env node

var Executor = require('./test_util').Executor;
var executor = new Executor();

testSuccessfulFeatures();
testFailingFeatures();
testFailFastFastOption();
testStrictOption();

executor.execute();

function testSuccessfulFeatures() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js')
    .alwaysEnableStdio()
    .expectExitCode(0);
}

function testFailingFeatures() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @failing')
    .expectExitCode(100)
    .expectOutput("expected 'My AngularJS App' to equal 'Failing scenario 1'")
    .expectOutput("expected 'My AngularJS App' to equal 'Failing scenario 2'");
}

function testFailFastFastOption() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @failing --cucumberOpts.fail-fast')
   .expectExitCode(100)
   .expectOutput("expected 'My AngularJS App' to equal 'Failing scenario 1'");
}

function testStrictOption() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @strict --cucumberOpts.strict')
   .expectExitCode(100)
   .expectOutput("/^this step is not defined$/")
   .expectOutput("Error: Cucumber scenarios failed.");
}
