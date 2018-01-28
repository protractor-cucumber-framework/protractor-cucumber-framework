let util = require('./test_util');

describe('cucumber version 4', function() {
  it('runs successful features', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber4Conf.js --cucumberOpts.tags @cucumber4'
      )
      .cucumberVersion4()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .expectOutput('2 steps (2 passed)')
      .expectErrors([])
      .run();
  });
});
