let util = require('./test_util');

describe('restart browsers between tests', function() {
  describe('cucumber v1', () => {
    it('should run', () => {
      return util
        .testCucumber1([
          'test/cucumber/conf/cucumber1Conf.js',
          '--cucumberOpts.tags',
          '@justThisOne',
          '--restartBrowserBetweenTests'
        ])
        .expectSuccessfulRun('1 scenario (1 passed)')
        .run();
    });
  });

  describe('cucumber v2', () => {
    it('should run', () => {
      return util
        .testCucumber2([
          'test/cucumber/conf/cucumber2Conf.js',
          '--cucumberOpts.tags',
          '@cucumber2',
          '--restartBrowserBetweenTests'
        ])
        .expectSuccessfulRun('1 scenario (1 passed)')
        .run();
    });
  });

  describe('cucumber v3', () => {
    it('should run with control flow enabled', () => {
      return util
        .testCucumber3([
          'test/cucumber/conf/cucumber3ConfWithControlFlow.js',
          '--cucumberOpts.tags',
          '@cucumber3',
          '--cucumberOpts.tags',
          '@tag1',
          '--restartBrowserBetweenTests'
        ])
        .expectSuccessfulRun('1 scenario (1 passed)')
        .run();
    });

    it('should run with control flow disabled', () => {
      return util
        .testCucumber3([
          'test/cucumber/conf/cucumber3Conf.js',
          '--cucumberOpts.tags',
          '@cucumber3',
          '--cucumberOpts.tags',
          '@tag1',
          '--restartBrowserBetweenTests'
        ])
        .expectSuccessfulRun('1 scenario (1 passed)')
        .run();
    });
  });

  describe('cucumber v4', () => {
    it('should run', () => {
      return util
        .testCucumber4([
          'test/cucumber/conf/cucumber4Conf.js',
          '--cucumberOpts.tags',
          '@cucumber4',
          '--restartBrowserBetweenTests'
        ])
        .expectSuccessfulRun('1 scenario (1 passed)')
        .run();
    });
  });
});
