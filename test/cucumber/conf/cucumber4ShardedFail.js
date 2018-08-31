let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: [
      '../stepDefinitions/**/cucumber4Steps.js',
      '../hooks/**/cucumber4FailedBeforeAll.js'
    ],
    tags: '@dev'
  }
});
