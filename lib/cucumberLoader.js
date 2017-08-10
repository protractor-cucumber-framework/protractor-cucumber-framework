let path = require('path');

module.exports.location = function() {
  let version = process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) return require.resolve('cucumber');

  return path.resolve(
    `test/multidep_modules/cucumber-${version}/node_modules/cucumber`
  );
};

module.exports.load = function() {
  let version = process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) return require('cucumber');
  return require('multidep')('test/multidep.js')('cucumber', version);
};

module.exports.majorVersion = function() {
  let version = process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) version = require('cucumber/package').version;
  return +version.split('.')[0];
};
