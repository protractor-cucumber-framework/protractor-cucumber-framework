var state = {};

state.initialize = function (runner, results) {
  state.runner = runner;
  state.results = results;
};

module.exports = state;
