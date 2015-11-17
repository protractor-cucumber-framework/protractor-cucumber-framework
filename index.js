var q = require('q'),
    assign = require('object-assign'),
    path = require('path');

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  // TODO - add the event interface for cucumber.
  var Cucumber = require('cucumber'),
      cucumberResolvedRequire;

  // Set up exec options for Cucumber
  var execOptions = assign({
    format: [],
    tags: [],
    require: [],
    compiler: []
  }, runner.getConfig().cucumberOpts);
  var configDir = runner.getConfig().configDir;

  // Make sure that some option are array
  ['compiler', 'format', 'tags', 'require'].forEach(function (option) {
    if (!Array.isArray(execOptions[option])) {
      execOptions[option] = [ execOptions[option] ];
    }
  });

  // Resolve require absolute path
  execOptions.require = execOptions.require.map(function (requirePath) {
    return path.resolve(configDir, requirePath)
  })

  global.cucumber = Cucumber.Cli(execOptions);

  var testResult = [];
  var stepResults = {
    description: null,
    assertions: [],
    duration: 0
  };
  var scenarioFailed = false;

  var failedCount = 0;
  // Add a listener into cucumber so that protractor can find out which
  // steps passed/failed
  var addResultListener = function(formatter) {
    var feature = { getName: function() { return ''; } };
    var originalHandleBeforeFeatureEvent = formatter.handleBeforeFeatureEvent;
    formatter.handleBeforeFeatureEvent = function(event, callback) {
      feature = event.getPayloadItem('feature');
      if (typeof originalHandleBeforeFeatureEvent == 'function') {
        originalHandleBeforeFeatureEvent.apply(formatter, arguments);
      } else {
        callback();
      }
    };
    var originalHandleAfterScenarioEvent = formatter.handleAfterScenarioEvent;
    formatter.handleAfterScenarioEvent = function(event, callback) {
      var scenarioInfo = {
        name: event.getPayloadItem('scenario').getName(),
        category: feature.getName()
      };
      stepResults.description = scenarioInfo.name;
      if (scenarioFailed) {
        ++failedCount;
        runner.emit('testFail', scenarioInfo);
      } else {
        runner.emit('testPass', scenarioInfo);
      }

      testResult.push(stepResults);
      stepResults = {
        description: null,
        assertions: [],
        duration: 0
      };
      scenarioFailed = false;

      if (originalHandleAfterScenarioEvent
          && typeof(originalHandleAfterScenarioEvent) === 'function') {
            originalHandleAfterScenarioEvent(event, callback);
      } else {
        callback();
      }
    };

    var originalHandleStepResultEvent = formatter.handleStepResultEvent;
    formatter.handleStepResultEvent = function(event, callback) {
      var stepResult = event.getPayloadItem('stepResult');
      var isStepFailed = stepResult.isFailed ?
        stepResult.isFailed() :
        stepResult.getStatus() === Cucumber.Status.FAILED;
      var isStepSuccessful = stepResult.isSuccessful ?
        stepResult.isSuccessful() :
        stepResult.getStatus() === Cucumber.Status.PASSED;

      if (isStepSuccessful) {
        stepResults.assertions.push({
          passed: true
        });
        stepResults.duration += stepResult.getDuration();
      } else if (isStepFailed) {
        scenarioFailed = true;
        var failureMessage = stepResult.getFailureException();
        stepResults.assertions.push({
          passed: false,
          errorMsg: failureMessage.message,
          stackTrace: failureMessage.stack
        });
        stepResults.duration += stepResult.getDuration();
      }

      if (originalHandleStepResultEvent
          && typeof(originalHandleStepResultEvent) === 'function') {
            originalHandleStepResultEvent(event, callback);
      } else {
        callback();
      }
    };
  };

  return runner.runTestPreparer().then(function() {
    return q.promise(function(resolve, reject) {
      var cucumberConf = Cucumber.Cli.Configuration(execOptions, specs);
      var runtime = Cucumber.Runtime(cucumberConf);
      var formatters = cucumberConf.getFormatter ?
        [cucumberConf.getFormatter()] :
        cucumberConf.getFormatters();

      addResultListener(formatters[0]);
      formatters.forEach(runtime.attachListener.bind(runtime));

      runtime.start(function() {
        try {
          if (runner.getConfig().onComplete) {
            runner.getConfig().onComplete();
          }
          resolve({
            failedCount: failedCount,
            specResults: testResult
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
};
