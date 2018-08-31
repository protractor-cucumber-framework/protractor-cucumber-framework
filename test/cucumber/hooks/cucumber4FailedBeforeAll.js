const path = require('path');

const {BeforeAll} = require(path.join(
  __dirname,
  '..',
  '..',
  '..',
  'lib',
  'cucumberLoader'
)).load();

BeforeAll(function(callback) {
  callback('Failed');
});
