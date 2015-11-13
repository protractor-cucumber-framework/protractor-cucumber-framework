var q = require('q'),
    glob = require('glob'),
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
      execOptions = ['node', 'node_modules/.bin/cucumber-js'],
      cucumberResolvedRequire;

  // Set up exec options for Cucumber
  execOptions = execOptions.concat(specs);
  if (runner.getConfig().cucumberOpts) {

    // Process Cucumber Require param
    if (runner.getConfig().cucumberOpts.require) {
      // TODO - this should move into the launcher.

      var requirePatterns = runner.getConfig().cucumberOpts.require;
      var configDir = runner.getConfig().configDir;

      requirePatterns = (typeof requirePatterns === 'string') ?
          [requirePatterns] : requirePatterns;

      cucumberResolvedRequire = [];

      if (requirePatterns) {
        for (var i = 0; i < requirePatterns.length; ++i) {
          // Cucumber allows running a spec given a line number.
          // If you deprecated node < v0.12, switch to using path.parse
          var fileName = requirePatterns[i];
          var lineNumber = /:\d+$/.exec(fileName);
          if (lineNumber) {
            fileName = fileName.slice(0, lineNumber.index);
            lineNumber = lineNumber[0].slice(1);
          }

          var matches = glob.sync(fileName, {cwd: configDir});

          if (!matches.length) {
            log.warn('pattern ' + requirePatterns[i] + ' did not match any files.');
          }
          for (var j = 0; j < matches.length; ++j) {
            var resolvedPath = path.resolve(configDir, matches[j]);
            if (lineNumber) {
              resolvedPath += ':' + lineNumber;
            }
            cucumberResolvedRequire.push(resolvedPath);
          }
        }
      }

      if (cucumberResolvedRequire && cucumberResolvedRequire.length) {
          execOptions = cucumberResolvedRequire.reduce(function(a, fn) {
            return a.concat('-r', fn);
          }, execOptions);
      }
    }

    // Process Cucumber Tag param
    if (Array.isArray(runner.getConfig().cucumberOpts.tags)) {
        for (var i in runner.getConfig().cucumberOpts.tags) {
            var tags = runner.getConfig().cucumberOpts.tags[i];
            execOptions.push('-t');
            execOptions.push(tags);
        }
    } else if (runner.getConfig().cucumberOpts.tags) {
      execOptions.push('-t');
      execOptions.push(runner.getConfig().cucumberOpts.tags);
    }

    // Process Cucumber Format param
    if (Array.isArray(runner.getConfig().cucumberOpts.format)) {
      runner.getConfig().cucumberOpts.format.forEach(function (format) {
        execOptions.push('-f');
        execOptions.push(format);
      });
    } else if (runner.getConfig().cucumberOpts.format) {
      execOptions.push('-f');
      execOptions.push(runner.getConfig().cucumberOpts.format);
    }

    // Process Cucumber 'coffee' param
    if (runner.getConfig().cucumberOpts.coffee) {
      execOptions.push('--coffee');
    }

    // Process Cucumber 'no-snippets' param
    if (runner.getConfig().cucumberOpts.noSnippets) {
      execOptions.push('--no-snippets');
    }

    // Process Cucumber 'dry-run' param
    if (runner.getConfig().cucumberOpts.dryRun) {
      execOptions.push('-d');
    }
  }
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
      var cucumberConf = Cucumber.Cli.Configuration(execOptions);
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
