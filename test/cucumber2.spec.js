let util = require('./test_util');

describe('cucumber version 2', function() {
  it('runs successful features', function() {
    return util
      .runOne('test/cucumber/conf/cucumber2Conf.js')
      .cucumberVersion2()
      .expectExitCode(0)
      .expectErrors([])
      .run();
  });

  it.skip('converts multiple tags to the new format', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber2Conf.js --cucumberOpts.tags @cucumber2 --cucumberOpts.tags ~@failing'
      )
      .cucumberVersion2()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .expectErrors([])
      .run();
  });

  it.skip('ignores tags when no value is passed', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber2Conf.js --cucumberOpts.tags --specs **/cucumber2.feature'
      )
      .cucumberVersion2()
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .run();
  });
});
