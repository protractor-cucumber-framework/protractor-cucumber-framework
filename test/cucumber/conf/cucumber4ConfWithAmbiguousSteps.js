let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: `${__dirname}/../stepDefinitions/**/cucumber4AmbiguousSteps.js`,
  },
});
