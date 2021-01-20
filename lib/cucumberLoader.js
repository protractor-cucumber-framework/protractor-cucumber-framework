let path = require('path');
const oldCucumberPackage = 'cucumber';
const newCucumberPackage = '@cucumber/cucumber';
const cucumberPackageNames = [oldCucumberPackage, newCucumberPackage];
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
  // cannot use multidep with @cucumber/cucumber because of installation checks
  if (!version) {
    if (!cucumberPackageName) {
      for (let i = 0; i < cucumberPackageNames.length; i++) {
        cucumberPackageName = cucumberPackageNames[i];
        try {
          return require(cucumberPackageName);
        } catch (e) {
          // ignore
        }
      }
    }
    return require(cucumberPackageName);
  } else if (version.startsWith('7')) {
    return require(newCucumberPackage);
  }
  return require('multidep')('test/multidep.js')(oldCucumberPackage, version);
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
        } catch (e) {
          // ignore
        }
      }
    } else {
      version = require(cucumberPackageName + '/package').version;
    }
  }
  return +version.split('.')[0];
};
