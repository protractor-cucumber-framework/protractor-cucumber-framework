var state = {};

state.initialize = function(runner, results, strict) {
  state.runner = runner;
  state.results = results;
  state.strict = strict;
};

module.exports = state;
