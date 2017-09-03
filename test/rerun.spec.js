let util = require('./test_util');

describe('rerun option', function() {
  it('run all features in the rerun file', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.rerun test/cucumber/@rerun.txt'
      )
      .expectExitCode(0)
      .expectOutput('1 scenario (1 passed)')
      .expectErrors([])
      .run();
  });
});
