let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: '../stepDefinitions/**/cucumber1Steps.js',
    tags: '@dev',
    'no-colors': true
  }
});
