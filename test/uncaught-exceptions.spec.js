let util = require('./test_util');

describe('uncaught exceptions', function() {
  it('should not stop the process', function() {
    return util.runOne('test/cucumber/conf/cucumber2Conf.js --cucumberOpts.tags @uncaughtException')
      .cucumberVersion2()
      .expectExitCode(1)
      .expectErrors([{message: 'unexpected'}, {message: 'unexpected'}])
      .expectOutput('2 scenarios (2 failed)')
      .run();
  });
});
