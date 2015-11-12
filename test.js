#!/usr/bin/env node

var Executor = require('./test_util').Executor;

var passingTests = ['node node_modules/protractor/lib/cli.js spec/cucumberConf.js'];

var executor = new Executor();

passingTests.forEach(function(passing_test) {
  executor.addCommandlineTest(passing_test)
      .assertExitCodeOnly();
});

executor.execute();
