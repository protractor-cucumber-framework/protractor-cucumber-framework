let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: '../stepDefinitions/**/cucumber4Steps.js',
    tags: '',
    format: 'summary',
    'format-options': '{"colorsEnabled": false}'
  }
});
