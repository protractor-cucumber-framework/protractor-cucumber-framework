let util = require('./test_util');

describe('restart browsers between tests', function() {
  describe('cucumber version 1', () => {
    it('should run', function() {
      let cmd = [
        'test/cucumber/conf/cucumber1Conf.js',
        '--cucumberOpts.tags',
        '@justThisOne',
        '--restartBrowserBetweenTests'
      ];

      return util
        .runOne(cmd)
        .expectExitCode(0)
        .expectOutput('1 scenario (1 passed)')
        .expectErrors([])
        .run();
    });
  });

  describe('cucumber version 2', () => {
    it('should run', function() {
      let cmd = [
        'test/cucumber/conf/cucumber2Conf.js',
        '--cucumberOpts.tags',
        '@cucumber2',
        '--restartBrowserBetweenTests'
      ];

      return util
        .runOne(cmd)
        .cucumberVersion2()
        .expectExitCode(0)
        .expectOutput('1 scenario (1 passed)')
        .expectErrors([])
        .run();
    });
  });

  describe('cucumber version 3', () => {
    it('should run', function() {
      let cmd = [
        'test/cucumber/conf/cucumber3Conf.js',
        '--cucumberOpts.tags',
        '@cucumber3',
        '--cucumberOpts.tags',
        '@tag1',
        '--restartBrowserBetweenTests'
      ];

      return util
        .runOne(cmd)
        .cucumberVersion3()
        .expectExitCode(0)
        .expectOutput('1 scenario (1 passed)')
        .expectErrors([])
        .run();
    });
  });
});
