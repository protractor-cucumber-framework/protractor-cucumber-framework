var state = require('./runState');
var Cucumber = require('./cucumberLoader').load();
var webdriverSync = require('./webdriverSync');

if (Cucumber.defineSupportCode) {
  Cucumber.defineSupportCode(function(supportCode) {
    registerHandlers.call(supportCode);
  });
} else {
  module.exports = registerHandlers;
}

function registerHandlers() {
  var scenarioFailed = false;
  var stepResults = buildStepResults();

  this.registerHandler('BeforeFeatures', function (event, callback) {
    clearResults();
    callback();
  });

  this.registerHandler('AfterScenario', function (scenario, callback) {
    var feature = getter(scenario, 'feature');
    var scenarioInfo = {
      name: getter(scenario, 'name'),
      category: getter(feature, 'name')
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

  this.registerHandler('StepResult', function(stepResult, callback) {
    switch (getter(stepResult, 'status')) {
      case Cucumber.Status.PASSED:
        stepResults.assertions.push({passed: true});
        break;
      case Cucumber.Status.FAILED:
        scenarioFailed = true;
        var failureMessage = getter(stepResult, 'failureException');
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
            errorMsg: 'Undefined steps are not allowed in strict mode'
          });
        }
        break;
    }

    stepResults.duration += getter(stepResult, 'duration');
    callback();
  });

  // Synchronise Cucumber with Webdriver Control Flow
  webdriverSync(this, protractor.browser.driver.controlFlow());
}

function buildStepResults() {
  return {
    description: null,
    assertions: [],
    duration: 0
  };
}

function clearResults() {
  state.results.failedCount = 0;
  state.results.specResults = [];
}

function getter(object, property) {
  var getterFunction = 'get' + property.charAt(0).toUpperCase() + property.slice(1);
  return object[getterFunction] ? object[getterFunction]() : object[property];
}
