let util = require('./test_util');

describe('cucumber version 9', function () {
  it('runs successful features', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber10Conf.js --cucumberOpts.tags @cucumber10'
      )
      .cucumberVersion10()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .expectOutput('2 steps (2 passed)')
      .expectErrors([])
      .run();
  });
});
