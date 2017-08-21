let path = require('path');

/*
 * Needed for testing since cucumber 3 checks to make sure you're not running
 * a version of cucumber outside the current working directory. There's a
 * loophole where it checks if it's testing itself that we'll use
 */
module.exports.cwd = function(version) {
  version = version || process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) return process.cwd();

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
