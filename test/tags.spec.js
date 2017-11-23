let util = require('./test_util');

describe('tags', function() {
  describe('cucumber 3', function() {
    it('ands by default', function() {
      const command =
        'test/cucumber/conf/cucumber3Conf.js --cucumberOpts.tags @cucumber3 --cucumberOpts.tags @tag1';
      return util
        .runOne(command)
        .cucumberVersion3()
        .expectExitCode(0)
        .expectOutput('1 scenario (1 passed)')
        .run();
    });

    it('can or', function() {
      const command = [
        'test/cucumber/conf/cucumber3Conf.js',
        '--cucumberOpts.tags',
        '@tag1 or @tag2'
      ];
      return util
        .runOne(command)
        .cucumberVersion3()
        .expectExitCode(0)
        .expectOutput('3 scenarios (3 passed)')
        .run();
    });
  });
});
