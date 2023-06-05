let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  capabilities: false,

  multiCapabilities: [env.capabilities, env.capabilities],

  cucumberOpts: {
    require: `${__dirname}/../stepDefinitions/**/cucumber1Steps.js`,
    tags: '@dev',
  },
});
