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
    if (scenarioFailed) ++state.results.failedCount;
    stepResults.description = getter(scenario, 'name');
    state.results.specResults.push(stepResults);
    stepResults = buildStepResults();
    scenarioFailed = false;

    let scenarioFinished = state.runner.afterEach ? state.runner.afterEach() : q();
    scenarioFinished.then(callback);
  });

  this.registerHandler('StepResult', function(stepResult, callback) {
    let step = getter(stepResult, 'step');
    let scenario = getter(step, 'scenario');
    let feature = getter(scenario, 'feature');
    if (!scenario.uri) scenario.uri = feature.uri;
    let emitterEvent = 'testPass';

    switch (getter(stepResult, 'status')) {
      case Cucumber.Status.PASSED:
        stepResults.assertions.push({passed: true});
        break;
      case Cucumber.Status.FAILED:
        emitterEvent = 'testFail';
        scenarioFailed = true;
        stepResults.assertions.push({
          passed: false,
          errorMsg: getter(stepResult, 'failureException').message,
          stackTrace: getter(stepResult, 'failureException').stack
        });
        break;
      case Cucumber.Status.UNDEFINED:
        if (state.strict) {
          emitterEvent = 'testFail';
          scenarioFailed = true;
          stepResults.assertions.push({
            passed: false,
            errorMsg: 'Undefined steps are not allowed in strict mode'
          });
        }
        break;
    }

    let duration = getter(stepResult, 'duration');
    if (isCucumber1()) duration = Math.round(duration / 1e6);

    state.runner.emit(emitterEvent, {
      name: `${getter(step, 'keyword')}${getter(step, 'name') || ''}`,
      category: `${getter(feature, 'name')}: ${getter(scenario, 'name')}`,
      durationMillis: duration
    });

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

function isCucumber1() {
  return !Cucumber.defineSupportCode;
}

