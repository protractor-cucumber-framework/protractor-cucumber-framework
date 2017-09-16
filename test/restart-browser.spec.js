let util = require('./test_util');

describe('restart browsers between tests', function() {
  it('should run all scenarios successfully', function() {
    let cmd =
      'test/cucumber/conf/cucumber3Conf.js --restartBrowserBetweenTests';

    return util
      .runOne(cmd)
      .cucumberVersion3()
      .expectExitCode(0)
      .expectOutput('3 scenarios (3 passed)')
      .expectErrors([])
      .run();
  });
});
