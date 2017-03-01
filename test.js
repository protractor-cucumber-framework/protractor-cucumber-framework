#!/usr/bin/env node

var Executor = require('./test_util').Executor;
var executor = new Executor();

testSuccessfulFeatures();
testFailingFeatures();
testFailFastFastOption();
testStrictOption();
testUndefinedWithoutStrictOption();
testMultiCapsOverrideBaseOptsAndCliOpts();
testRerunOption();

executor.execute();

function testSuccessfulFeatures() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/cucumberConf.js')
    .alwaysEnableStdio()
    .expectExitCode(0);
}

function testFailingFeatures() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/cucumberConf.js --cucumberOpts.tags @failing')
    .expectExitCode(1)
    .expectErrors([
      { message:"expected 'My AngularJS App' to equal 'Failing scenario 1'" },
      { message:"expected 'My AngularJS App' to equal 'Failing scenario 2'" }
    ]);
}

function testFailFastFastOption() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/cucumberConf.js --cucumberOpts.tags @failing --cucumberOpts.fail-fast')
   .expectExitCode(1)
   .expectErrors([{ message: "expected 'My AngularJS App' to equal 'Failing scenario 1'" }]);
}

function testStrictOption() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/cucumberConf.js --cucumberOpts.tags @strict --cucumberOpts.strict')
   .expectExitCode(1)
   .expectErrors([{ message: "Undefined steps are not allowed in strict mode" }]);
}

function testUndefinedWithoutStrictOption() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/cucumberConf.js --cucumberOpts.tags @strict')
   .expectExitCode(0)
   .expectErrors([]);
}

function testMultiCapsOverrideBaseOptsAndCliOpts() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/multiConf.js --cucumberOpts.tags @failing')
   .expectExitCode(0)
   .expectErrors([]);
}

function testRerunOption() {
  executor.addCommandlineTest('node_modules/protractor/bin/protractor spec/cucumberConf.js --cucumberOpts.tags @rerun --cucumberOpts.rerun spec/@rerun.txt')
   .expectExitCode(0)
   .expectErrors([]);
}
