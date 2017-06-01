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

  this.registerHandler('BeforeFeatures', function() {
    clearResults();
  });

  this.registerHandler('AfterScenario', function(scenario) {
    if (scenarioFailed) ++state.results.failedCount;
    stepResults.description = get(scenario, 'name');
    state.results.specResults.push(stepResults);
    stepResults = buildStepResults();
    scenarioFailed = false;
    if (state.runner.afterEach) return state.runner.afterEach();
  });

  this.registerHandler('StepResult', function(stepResult) {
    let step = get(stepResult, 'step');
    let scenario = get(step, 'scenario');
    let feature = get(scenario, 'feature');
    if (!scenario.uri) scenario.uri = feature.uri;
    let emitterEvent = 'testPass';

    switch (get(stepResult, 'status')) {
      case Cucumber.Status.PASSED:
        stepResults.assertions.push({passed: true});
        break;
      case Cucumber.Status.FAILED:
        emitterEvent = 'testFail';
        scenarioFailed = true;
        stepResults.assertions.push({
          passed: false,
          errorMsg: get(stepResult, 'failureException').message,
          stackTrace: get(stepResult, 'failureException').stack
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

    let duration = get(stepResult, 'duration');
    if (isCucumber1()) duration = Math.round(duration / 1e6);
    stepResults.duration += duration;

    if (!is(step, 'hidden')) {
      let eventDetails = {
        name: `${get(step, 'keyword')}${get(step, 'name') || ''}`,
        category: `${get(feature, 'name')}: ${get(scenario, 'name')}`,
        durationMillis: duration,
        sourceLocation: {
          filePath: get(scenario, 'uri'),
          line: get(step, 'line'),
          column: 1
        }
      };

      stepResults.events.push(Object.assign({emitterEvent}, eventDetails));
      state.runner.emit(emitterEvent, eventDetails);
    }
  });
}

function buildStepResults() {
  return {
    description: null,
    assertions: [],
    events: [],
    duration: 0
  };
}

function clearResults() {
  state.results.failedCount = 0;
  state.results.specResults = [];
}

function get(object, property) {
  let getterFunction = 'get' + property.charAt(0).toUpperCase() + property.slice(1);
  return object[getterFunction] ? object[getterFunction]() : object[property];
}

function is(object, property) {
  let getterFunction = 'is' + property.charAt(0).toUpperCase() + property.slice(1);
  return object[getterFunction] ? object[getterFunction]() : object[property];
}

function isCucumber1() {
  return !Cucumber.defineSupportCode;
}

