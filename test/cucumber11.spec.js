let util = require('./test_util');

describe('cucumber version 11', function () {
  it('runs successful features', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber11Conf.js --cucumberOpts.tags @cucumber11',
      )
      .cucumberVersion10()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .expectOutput('2 steps (2 passed)')
      .expectErrors([])
      .run();
  });
});
