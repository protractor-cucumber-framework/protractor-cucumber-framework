let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  SELENIUM_PROMISE_MANAGER: false,
  cucumberOpts: {
    require: `${__dirname}/../stepDefinitions/**/cucumber2Steps.js`,
    tags: '',
    format: 'summary',
    strict: true,
    'format-options': '{"colorsEnabled": false}',
  },
});
