/**
 * Port of Serenity/JS (https://github.com/jan-molak/serenity-js) webdriver adapter/ syncroniser
 * for use with protractor-cucumber-framework
 * original author: @jan-molak (https://github.com/jan-molak)
 * 
 * Monkey-patches Cucumber.js Given/When/Then step generators to ensure that any step definition they create
 * is executed within WebDriver's ControlFlow and therefore synchronised with it
 *
 * @param cucumber
 * @param controlFlow
 */
module.exports = function(cucumber, controlFlow) {

  [
    'Given',
    'When',
    'Then',
  ]
    .forEach(stepGenerator => cucumber[stepGenerator] = synchronising(cucumber[stepGenerator]));

  // ---

  /**
   * Creates a synchronising StepGenerator, which looks like a regular StepGenerator but with this signifficant
   * difference, that any step function passed to it will be wrapped and executed in the context of WebDriver
   * Control Flow
   *
   * @param originalStepGenerator
   * @return {StepGenerator}
   */
  function synchronising(originalStepGenerator) {

    function synchronisingStepGenerator(pattern, options, code) {

      var originalStep = code || options,
        synchronised = mimic(originalStep, synchronisedStep(originalStep));

      var params = !!code
        ? [pattern, options, synchronised]
        : [pattern, synchronised];

      return originalStepGenerator.apply(cucumber, params);
    }

    return mimic(originalStepGenerator, synchronisingStepGenerator);
  }

  /**
   * Provides a synchronised wrapper around the user-defined step
   *
   * @param originalStep
   * @return {(args:...[any])=>Promise<void>}
   */
  function synchronisedStep(originalStep) {
    return function (args) {
      args = Array.fromArguments(args);
      var deferred = new protractor.promise.Promise(),
        context = this;

      controlFlow
        .execute(() => originalStep.apply(context, args))
        .then(deferred.resolve, deferred.reject);

      return deferred.promise;
    };
  }
}

/**
 * Makes the pretender function of the same arity as the original one to deceive cucumber.
 *
 * @param original
 * @param pretender
 * @return {(args:...[any])=>any}
 */
function mimic(original, pretender) {
  return withArityOf(original.length, pretender);
}

function withArityOf(arity, fn) {
  var params = Array(arity + 1).join(', _').substr(2);
  var newFunction = new Function(
    'fn',
    'return function (' + params + ') { return fn.apply(this, arguments); }'
  );
  return newFunction(fn);
}
