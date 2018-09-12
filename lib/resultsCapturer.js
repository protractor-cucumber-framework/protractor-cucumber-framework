let state = require('./runState');
let cucumberLoader = require('./cucumberLoader');
let cucumberVersion = cucumberLoader.majorVersion();
let Cucumber = cucumberLoader.load();
let gherkinDocuments = {};
let scenarioFailed = false;
let stepResults = buildStepResults();

switch (cucumberVersion) {
  case 0:
  case 1:
    module.exports = registerHandlers;
    break;

  case 2:
    Cucumber.defineSupportCode(support => registerHandlers.call(support));
    break;

  case 3:
    Cucumber.defineSupportCode(({After}) => After(runAfterEachScenario));
    module.exports = eventListeners;
    break;

  case 4:
  case 5:
    Cucumber.After(runAfterEachScenario);
    module.exports = eventListeners;
    break;

  default:
    throw new Error(`We don't support cucumber version ${cucumberVersion}`);
}

function runAfterEachScenario() {
  if (state.runner.afterEach) {
    return state.runner.afterEach().then(emitScenarioResults);
  } else {
    emitScenarioResults();
  }
}

function emitScenarioResults() {
  stepResults.emitToTestRunner.forEach(([event, details]) => {
    state.runner.emit(event, details);
  });
}

function registerHandlers() {
  this.After(runAfterEachScenario);
  this.registerHandler('BeforeFeatures', setup);
  this.registerHandler('AfterScenario', afterScenarioHandler);
  this.registerHandler('StepResult', stepResultHandler);
}

function eventListeners(options) {
  options.eventBroadcaster.on('gherkin-document', cacheDocument);
  options.eventBroadcaster.on('test-run-started', setup);
  options.eventBroadcaster.on('test-case-finished', testCaseFinished);
  options.eventBroadcaster.on('test-step-finished', testStepFinished);
}

function setup() {
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
  const children = findFeature(location).children;
  const scenario = children.find(
    child => child.type === 'Scenario' && child.location.line === location.line
  );

  if (scenario) {
    return scenario;
  }

  const outlines = children.filter(child => child.type === 'ScenarioOutline');
  return findOutlineScenario(outlines, location);
}

function findOutlineScenario(outlines, location) {
  return outlines
    .map(child => createScenarioFromOutline(child, location))
    .find(outline => !!outline);
}

function createScenarioFromOutline(outline, location) {
  const foundExample = outline.examples.find(example => {
    const foundRow = example.tableBody.find(
      row => row.location.line === location.line
    );

    return !!foundRow;
  });

  if (!foundExample) return null;

  return createScenarioFromOutlineExample(outline, foundExample, location);
}

function createScenarioFromOutlineExample(outline, example, location) {
  const found = example.tableBody.find(
    row => row.location.line === location.line
  );

  if (!found) return null;

  return {
    type: 'Scenario',
    steps: createSteps(example.tableHeader, found, outline.steps),
    name: outline.name,
    location: found.location
  };
}

function createSteps(header, row, steps) {
  return steps.map(step => {
    const modified = Object.assign({}, step);

    header.cells.forEach((varable, index) => {
      modified.text = modified.text.replace(
        '<' + varable.value + '>',
        row.cells[index].value
      );
    });

    return modified;
  });
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
}

function testStepFinished(data) {
  let feature = findFeature(data.testCase.sourceLocation);
  let scenario = findScenario(data.testCase.sourceLocation);
  let step = scenario.steps[data.index];

  let progress = {
    step: data.index + 1,
    steps: scenario.steps.length
  };

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
    featureName: feature.name,
    progress
  };

  commonStepFinished(context);
}

function stepResultHandler(stepResult) {
  let step = get(stepResult, 'step');
  let scenario = get(step, 'scenario');
  let feature = get(scenario, 'feature');
  let steps = get(scenario, 'steps');
  if (!scenario.uri) scenario.uri = feature.uri;

  let progress = {
    step: steps.indexOf(step) + 1,
    steps: steps.length
  };

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
    featureName: get(feature, 'name'),
    progress
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
  featureName,
  progress
}) {
  let emitterEvent = 'testPass';

  switch (status) {
    case Cucumber.Status.PASSED:
      stepResults.assertions.push({passed: true});
      break;

    case Cucumber.Status.AMBIGUOUS:
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
      },
      progress
    };

    stepResults.events.push(Object.assign({emitterEvent}, eventDetails));
    stepResults.emitToTestRunner.push([emitterEvent, eventDetails]);
  }
}

function buildStepResults() {
  return {
    description: null,
    assertions: [],
    events: [],
    emitToTestRunner: [],
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
