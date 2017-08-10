let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: '../stepDefinitions/**/cucumber2Steps.js',
    tags: '@cucumber3',
    format: 'summary',
    strict: true,
    'format-options': '{"colorsEnabled": false}'
  }
});
