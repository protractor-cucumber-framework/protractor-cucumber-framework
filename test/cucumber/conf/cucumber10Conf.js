let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: `${__dirname}/../stepDefinitions/**/cucumber10Steps.js`,
    tags: '',
    format: 'summary',
    'format-options': '{"colorsEnabled": false}',
  },
});
