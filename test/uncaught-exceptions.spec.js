let util = require('./test_util');

describe('uncaught exceptions', function () {
  it('should not stop the process for cucumber 1', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @uncaughtException',
      )
      .expectExitCode(1)
      .expectErrors([
        {message: 'No element found'},
        {message: 'No element found'},
      ])
      .expectOutput('2 scenarios (2 failed)')
      .run();
  });

  it('should not stop the process for cucumber 2', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber2Conf.js --cucumberOpts.tags @uncaughtException',
      )
      .cucumberVersion2()
      .expectExitCode(1)
      .expectErrors([
        {message: 'No element found'},
        {message: 'No element found'},
      ])
      .expectOutput('2 scenarios (2 failed)')
      .run();
  });
});
