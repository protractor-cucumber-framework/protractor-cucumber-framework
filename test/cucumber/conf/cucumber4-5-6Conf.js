let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  cucumberOpts: {
    require: `${__dirname}/../stepDefinitions/**/cucumber4Steps.js`,
    tags: '',
    format: 'summary',
    strict: true,
    'format-options': '{"colorsEnabled": false}',
  },
});
