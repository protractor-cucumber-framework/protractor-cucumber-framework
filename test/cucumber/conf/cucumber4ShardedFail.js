let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: [
      `${ __dirname }/../stepDefinitions/**/cucumber4Steps.js`,
      `${ __dirname }/../hooks/**/cucumber4FailedBeforeAll.js`
    ],
    tags: '@dev'
  }
});
