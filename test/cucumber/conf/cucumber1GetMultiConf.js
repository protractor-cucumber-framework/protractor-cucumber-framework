let env = require('./environment.js');

exports.config = Object.assign({}, env, {
  capabilities: false,

  getMultiCapabilities: function() {
    return [env.capabilities, env.capabilities];
  },

  cucumberOpts: {
    require: '../stepDefinitions/**/cucumber1Steps.js',
    tags: '@dev'
  }
});
