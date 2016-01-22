var state = require('./runState');
var Cucumber = require('cucumber');

function buildStepResults() {
  return {
    description: null,
    assertions: [],
    duration: 0
  }
}

function buildFeature() {
  return {
    getName: function() {
      return '';
    }
  };
}

function clearResults() {
  state.results.failedCount = 0;
  state.results.specResults = [];
}

module.exports = function () {
  var scenarioFailed = false;
  var feature = buildFeature();
  var stepResults = buildStepResults();

  this.registerHandler('BeforeFeatures', function (event, callback) {
    clearResults();
    callback();
  });

  this.registerHandler('BeforeFeature', function (event, callback) {
    feature = event.getPayloadItem('feature');
    callback();
  });

  this.registerHandler('AfterScenario', function (event, callback) {
    var scenarioInfo = {
      name: event.getPayloadItem('scenario').getName(),
      category: feature.getName()
    };
    stepResults.description = scenarioInfo.name;

    if (scenarioFailed) {
      ++state.results.failedCount;
      state.runner.emit('testFail', scenarioInfo);
    } else {
      state.runner.emit('testPass', scenarioInfo);
    }

    state.results.specResults.push(stepResults);
    stepResults = buildStepResults();
    scenarioFailed = false;
    callback();
  });

  this.registerHandler('StepResult', function (event, callback) {
    var stepResult = event.getPayloadItem('stepResult');

    switch (stepResult.getStatus()) {
      case Cucumber.Status.PASSED:
        stepResults.assertions.push({passed: true});
        break;
      case Cucumber.Status.FAILED:
        scenarioFailed = true;
        var failureMessage = stepResult.getFailureException();
        stepResults.assertions.push({
          passed: false,
          errorMsg: failureMessage.message,
          stackTrace: failureMessage.stack
        });
        break;
      case Cucumber.Status.UNDEFINED:
        if (state.strict) {
          scenarioFailed = true;
          stepResults.assertions.push({
            passed: false,
            errorMsg: "Undefined steps are not allowed in strict mode"
          });
        }
        break;
    }

    stepResults.duration += stepResult.getDuration();
    callback();
  });
};
