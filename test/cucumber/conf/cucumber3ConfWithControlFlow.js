const {config} = require('./cucumber3Conf');

exports.config = Object.assign({}, config, {
  SELENIUM_PROMISE_MANAGER: true,
});
