let util = require('./test_util');

describe('ambiguous steps', function () {
  it('fails with ambiguous steps', function () {
    return util
      .runOne(
        'test/cucumber/conf/cucumber4ConfWithAmbiguousSteps.js --cucumberOpts.tags @cucumber4',
      )
      .cucumberVersion4()
      .expectExitCode(1)
      .expectErrors([{}])
      .run();
  });
});
