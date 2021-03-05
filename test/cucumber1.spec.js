let util = require('./test_util');

describe('cucumber version 1', function() {
  it('runs successful features', function() {
    return util
      .runOne('test/cucumber/conf/cucumber1Conf.js')
      .expectExitCode(0)
      .expectOutput('2 scenarios (2 passed)')
      .run();
  });

  it('runs failing features', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @failing'
      )
      .expectExitCode(1)
      .expectErrors([
        {message: "expected 'My AngularJS App' to equal 'Failing scenario 1'"},
        {message: "expected 'My AngularJS App' to equal 'Failing scenario 2'"}
      ])
      .run();
  });

  it('accepts the fail fast option', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @failing --cucumberOpts.fail-fast'
      )
      .expectExitCode(1)
      .expectErrors([
        {message: "expected 'My AngularJS App' to equal 'Failing scenario 1'"}
      ])
      .run();
  });

  it('fails undefined steps with strict', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @strict --cucumberOpts.strict'
      )
      .expectExitCode(1)
      .expectErrors([
        {message: 'Step not implemented'}
      ])
      .run();
  });

  it('passes undefined steps without strict', function() {
    return util
      .runOne('test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @strict --cucumberOpts.noStrict')
      .expectExitCode(0)
      .expectErrors([])
      .run();
  });

  it('accepts multiple name options', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.name Running --cucumberOpts.name Wrapping'
      )
      .expectExitCode(0)
      .expectOutput('2 scenarios (2 passed)')
      .run();
  });

  it('overrides base and cli options with multi capability options', function() {
    return util
      .runOne('test/cucumber/conf/multiConf.js --cucumberOpts.tags @failing')
      .expectExitCode(0)
      .expectErrors([])
      .run();
  });
});
