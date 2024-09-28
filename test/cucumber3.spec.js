let util = require('./test_util');

describe('cucumber version 3', function () {
  it('runs successful features', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber3Conf.js --cucumberOpts.tags @cucumber3',
      )
      .cucumberVersion3()
      .expectExitCode(0)
      .expectOutput('3 scenarios (3 passed)')
      .expectErrors([])
      .run();
  });

  it('ignores tags when the value is an empty string', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber3Conf.js --specs **/cucumber2.feature',
      )
      .cucumberVersion3()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .run();
  });
});
