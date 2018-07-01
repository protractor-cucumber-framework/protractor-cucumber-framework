let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: '../stepDefinitions/**/cucumber4AmbiguousSteps.js'
  }
});
