let util = require('./test_util');

describe('cucumber version 3', function() {
  it('runs successful features', function() {
    return util
      .runOne('test/cucumber/conf/cucumber3Conf.js')
      .cucumberVersion3()
      .expectExitCode(0)
      //.expectOutput('1 scenario (1 passed)')
      .expectErrors([])
      .run();
  });
});
