var state = {};

state.initialize = function(runner, results, strict, retries) {
  state.runner = runner;
  state.results = results;
  state.strict = strict;
  state.retries = retries;
};

module.exports = state;
