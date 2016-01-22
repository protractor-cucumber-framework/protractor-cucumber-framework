#!/usr/bin/env node

var Executor = require('./test_util').Executor;
var executor = new Executor();

testSuccessfulFeatures();
testFailingFeatures();
testFailFastFastOption();
testStrictOption();
testUndefinedWithoutStrictOption();

executor.execute();

function testSuccessfulFeatures() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js')
    .alwaysEnableStdio()
    .expectExitCode(0);
}

function testFailingFeatures() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @failing')
    .expectExitCode(1)
    .expectErrors([
      { message:"expected 'My AngularJS App' to equal 'Failing scenario 1'" },
      { message:"expected 'My AngularJS App' to equal 'Failing scenario 2'" }
    ]);
}

function testFailFastFastOption() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @failing --cucumberOpts.fail-fast')
   .expectExitCode(1)
   .expectErrors([{ message: "expected 'My AngularJS App' to equal 'Failing scenario 1'" }]);
}

function testStrictOption() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @strict --cucumberOpts.strict')
   .expectExitCode(1)
   .expectErrors([{ message: "Undefined steps are not allowed in strict mode" }]);
}

function testUndefinedWithoutStrictOption() {
  executor.addCommandlineTest('node node_modules/protractor/lib/cli.js spec/cucumberConf.js --cucumberOpts.tags @strict')
   .expectExitCode(0)
   .expectErrors([]);
}
