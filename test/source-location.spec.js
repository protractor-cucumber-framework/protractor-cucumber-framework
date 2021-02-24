let util = require('./test_util');

describe('source locations', function() {
  it.skip('cucumber 1 provides source locations to protractor', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber1Conf.js --cucumberOpts.tags @sourceLocation'
      )
      .expectExitCode(0)
      .expectEvents([
        {
          emitterEvent: 'testPass',
          category: 'Running Cucumber with Protractor: Wrapping WebDriver',
          name: 'Given I go on "index.html"',
          sourceLocation: {
            filePath: /.*\/protractor-cucumber-framework\/test\/cucumber\/features\/cucumber1\.feature/,
            line: 14,
            column: 1
          }
        },
        {
          emitterEvent: 'testPass',
          category: 'Running Cucumber with Protractor: Wrapping WebDriver',
          name: 'Then the title should equal "My AngularJS App"',
          sourceLocation: {
            filePath: /.*\/protractor-cucumber-framework\/test\/cucumber\/features\/cucumber1\.feature/,
            line: 15,
            column: 1
          }
        }
      ])
      .run();
  });

  it.skip('cucumber 2 provides source locations to protractor', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber2Conf.js --cucumberOpts.tags @cucumber2'
      )
      .cucumberVersion2()
      .expectExitCode(0)
      .expectEvents([
        {
          emitterEvent: 'testPass',
          category: 'Running Cucumber 2 with Protractor: Using Cucumber 2',
          name: 'Given I go on "index.html"',
          sourceLocation: {
            filePath: /.*\/protractor-cucumber-framework\/test\/cucumber\/features\/cucumber2\.feature/,
            line: 5,
            column: 1
          }
        },
        {
          emitterEvent: 'testPass',
          category: 'Running Cucumber 2 with Protractor: Using Cucumber 2',
          name: 'Then the title should equal "My AngularJS App"',
          sourceLocation: {
            filePath: /.*\/protractor-cucumber-framework\/test\/cucumber\/features\/cucumber2\.feature/,
            line: 6,
            column: 1
          }
        }
      ])
      .run();
  });

  it.skip('cucumber 3 provides source locations to protractor', function() {
    return util
      .runOne(
        'test/cucumber/conf/cucumber3Conf.js --cucumberOpts.tags @cucumber3'
      )
      .cucumberVersion3()
      .expectExitCode(0)
      .expectEvents([
        {
          emitterEvent: 'testPass',
          category: 'Running Cucumber 3 with Protractor: Using Cucumber 3',
          name: 'Given I go on "index.html"',
          sourceLocation: {
            filePath: /.*\/cucumber\/features\/cucumber3\.feature/,
            line: 5,
            column: 5
          }
        },
        {
          emitterEvent: 'testPass',
          category: 'Running Cucumber 3 with Protractor: Using Cucumber 3',
          name: 'Then the title should equal "My AngularJS App"',
          sourceLocation: {
            filePath: /.*\/cucumber\/features\/cucumber3\.feature/,
            line: 6,
            column: 5
          }
        }
      ])
      .run();
  });
});
