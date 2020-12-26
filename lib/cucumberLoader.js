let path = require('path');
const cucumberPackageNames = ["cucumber", "@cucumber/cucumber"];
let cucumberPackageName;

/*
 * Needed for testing since cucumber 3 checks to make sure you're not running
 * a version of cucumber outside the current working directory. There's a
 * loophole where it checks if it's testing itself that we'll use
 */
module.exports.cwd = function(version) {
  version = version || process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) return process.cwd();

  return path.resolve(
    `test/multidep_modules/cucumber-${version}/node_modules/${cucumberPackageName}`
  );
};

module.exports.load = function() {
  let version = process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) {
  if (!cucumberPackageName) {
    for (let i = 0; i < cucumberPackageNames.length; i++) {
      cucumberPackageName = cucumberPackageNames[i];
      try {
        return require(cucumberPackageName);
      } catch {}
    }
  }
  return require(cucumberPackageName);
  }
  return require('multidep')('test/multidep.js')(cucumberPackageName, version);
};

module.exports.majorVersion = function() {
  let version = process.env.MULTIDEP_CUCUMBER_VERSION;
  if (!version) {
  if (!cucumberPackageName) {
    for (let i = 0; i < cucumberPackageNames.length; i++) {
      cucumberPackageName = cucumberPackageNames[i];
      try {
        version = require(cucumberPackageName + '/package').version;
        i = cucumberPackageNames.length;
      } catch {}
    }
  } else {
    version = require(cucumberPackageName + '/package').version;
  }
  }
  return +version.split('.')[0];
};
