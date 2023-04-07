let util = require('./test_util');

describe('cucumber version 9', function () {
  it('runs successful features', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber9Conf.js --cucumberOpts.tags @cucumber9'
      )
      .cucumberVersion9()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .expectOutput('2 steps (2 passed)')
      .expectErrors([])
      .run();
  });
});
