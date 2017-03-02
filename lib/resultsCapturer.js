let q = require('q');
let state = require('./runState');
let Cucumber = require('./cucumberLoader').load();

if (Cucumber.defineSupportCode) {
  Cucumber.defineSupportCode(function(supportCode) {
    registerHandlers.call(supportCode);
  });
} else {
  module.exports = registerHandlers;
}

function registerHandlers() {
  let scenarioFailed = false;
  let stepResults = buildStepResults();

  this.registerHandler('BeforeFeatures', function (event, callback) {
    clearResults();
    callback();
  });

  this.registerHandler('AfterScenario', function (scenario, callback) {
    let feature = getter(scenario, 'feature');
    let scenarioInfo = {
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

    let scenarioFinished = state.runner.afterEach ? state.runner.afterEach() : q();
    scenarioFinished.then(callback);
  });

  this.registerHandler('StepResult', function(stepResult, callback) {
    let failureMessage;

    switch (getter(stepResult, 'status')) {
      case Cucumber.Status.PASSED:
        stepResults.assertions.push({passed: true});
        break;
      case Cucumber.Status.FAILED:
        scenarioFailed = true;
        failureMessage = getter(stepResult, 'failureException');
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
  let getterFunction = 'get' + property.charAt(0).toUpperCase() + property.slice(1);
  return object[getterFunction] ? object[getterFunction]() : object[property];
}
