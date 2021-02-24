let util = require('./test_util');

describe('progress', function() {
  it.skip('cucumber 1 provides feature progress details to protractor', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @sourceLocation'
      )
      .expectExitCode(0)
      .expectEvents([
        {
          progress: {
            step: 1,
            steps: 2
          }
        },
        {
          progress: {
            step: 2,
            steps: 2
          }
        }
      ])
      .run();
  });

  it.skip('cucumber 2 provides feature progress details to protractor', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber2Conf.js --cucumberOpts.tags @cucumber2'
      )
      .cucumberVersion2()
      .expectExitCode(0)
      .expectEvents([
        {
          progress: {
            step: 1,
            steps: 2
          }
        },
        {
          progress: {
            step: 2,
            steps: 2
          }
        }
      ])
      .run();
  });

  it.skip('cucumber 3 provides feature progress details to protractor', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber3Conf.js --cucumberOpts.tags @cucumber3'
      )
      .cucumberVersion3()
      .expectExitCode(0)
      .expectEvents([
        {
          progress: {
            step: 1,
            steps: 2
          }
        },
        {
          progress: {
            step: 2,
            steps: 2
          }
        }
      ])
      .run();
  });
});
