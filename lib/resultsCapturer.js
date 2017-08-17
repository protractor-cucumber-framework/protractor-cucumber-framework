let state = require('./runState');
let cucumberLoader = require('./cucumberLoader');
let cucumberVersion = cucumberLoader.majorVersion();
let Cucumber = cucumberLoader.load();

switch (cucumberVersion) {
  case 0:
  case 1:
    module.exports = registerHandlers;
    break;

  case 2:
    Cucumber.defineSupportCode(support => registerHandlers.call(support));
    break;

  case 3:
    module.exports = eventListeners;
    break;

  default:
    throw new Error(`We don't support cucumber version ${cucumberVersion}`);
}

let gherkinDocuments = {};
let scenarioFailed = false;
let stepResults = buildStepResults();

function registerHandlers() {
  this.registerHandler('BeforeFeatures', clearResults);
  this.registerHandler('AfterScenario', afterScenarioHandler);
  this.registerHandler('StepResult', stepResultHandler);
}

function eventListeners(options) {
  options.eventBroadcaster.on('gherkin-document', cacheDocument);
  options.eventBroadcaster.on('test-run-started', clearResults);
  options.eventBroadcaster.on('test-case-finished', testCaseFinished);
  options.eventBroadcaster.on('test-step-finished', testStepFinished);
}

function clearResults() {
  state.results.failedCount = 0;
  state.results.specResults = [];
}

function cacheDocument(gherkinDocument) {
  gherkinDocuments[gherkinDocument.uri] = gherkinDocument.document;
}

function findFeature(location) {
  return gherkinDocuments[location.uri].feature;
}

function findScenario(location) {
  return findFeature(location).children.find(
    child => child.type === 'Scenario' && child.location.line === location.line
  );
}

function testCaseFinished(data) {
  commonScenarioFinished(findScenario(data.sourceLocation).name);
}

function afterScenarioHandler(scenario) {
  commonScenarioFinished(get(scenario, 'name'));
}

function commonScenarioFinished(scenarioName) {
  if (scenarioFailed) ++state.results.failedCount;
  stepResults.description = scenarioName;
  state.results.specResults.push(stepResults);
  stepResults = buildStepResults();
  scenarioFailed = false;
  if (state.runner.afterEach) return state.runner.afterEach();
}

function testStepFinished(data) {
  let feature = findFeature(data.testCase.sourceLocation);
  let scenario = findScenario(data.testCase.sourceLocation);
  let step = scenario.steps[data.index];

  let context = {
    uri: data.testCase.sourceLocation.uri,
    line: step ? step.location.line : undefined,
    column: step ? step.location.column : undefined,
    status: data.result.status,
    duration: data.result.duration,
    exception: data.result.exception,
    isHidden: !step,
    keyword: step ? step.keyword : undefined,
    stepName: step ? step.text : undefined,
    scenarioName: scenario.name,
    featureName: feature.name
  };

  commonStepFinished(context);
}

function stepResultHandler(stepResult) {
  let step = get(stepResult, 'step');
  let scenario = get(step, 'scenario');
  let feature = get(scenario, 'feature');
  if (!scenario.uri) scenario.uri = feature.uri;

  let data = {
    uri: get(scenario, 'uri'),
    line: get(step, 'line'),
    column: 1,
    status: get(stepResult, 'status'),
    duration: get(stepResult, 'duration'),
    exception: get(stepResult, 'failureException'),
    isHidden: is(step, 'hidden'),
    keyword: get(step, 'keyword'),
    stepName: get(step, 'name') || '',
    scenarioName: get(scenario, 'name'),
    featureName: get(feature, 'name')
  };

  commonStepFinished(data);
}

function commonStepFinished({
  status,
  duration,
  exception,
  uri,
  line,
  column,
  isHidden,
  keyword,
  stepName,
  scenarioName,
  featureName
}) {
  let emitterEvent = 'testPass';

  switch (status) {
    case Cucumber.Status.PASSED:
      stepResults.assertions.push({passed: true});
      break;

    case Cucumber.Status.FAILED:
      emitterEvent = 'testFail';
      scenarioFailed = true;
      stepResults.assertions.push({
        passed: false,
        errorMsg: exception.message,
        stackTrace: exception.stack
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

  if (cucumberVersion <= 1) duration = Math.round(duration / 1e6);
  stepResults.duration += duration;

  if (!isHidden) {
    let eventDetails = {
      name: `${keyword}${stepName}`,
      category: `${featureName}: ${scenarioName}`,
      durationMillis: duration,
      sourceLocation: {
        filePath: uri,
        line,
        column
      }
    };

    stepResults.events.push(Object.assign({emitterEvent}, eventDetails));
    state.runner.emit(emitterEvent, eventDetails);
  }
}

function buildStepResults() {
  return {
    description: null,
    assertions: [],
    events: [],
    duration: 0
  };
}

function get(object, property) {
  let getterFunction =
    'get' + property.charAt(0).toUpperCase() + property.slice(1);
  return object[getterFunction] ? object[getterFunction]() : object[property];
}

function is(object, property) {
  let getterFunction =
    'is' + property.charAt(0).toUpperCase() + property.slice(1);
  return object[getterFunction] ? object[getterFunction]() : object[property];
}
