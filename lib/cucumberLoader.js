const path = require('path');

/*
 * Needed for testing since cucumber 3 checks to make sure you're not running
 * a version of cucumber outside the current working directory. There's a
 * loophole where it checks if it's testing itself that we'll use
 */
module.exports.cwd = function(serialisedCucumberConf, defaultCwd = process.cwd()) {
  if (! serialisedCucumberConf) {
    return defaultCwd;
  }

  const cucumberConf = JSON.parse(serialisedCucumberConf);

  return path.resolve(
      `test/multidep_modules/${cucumberConf.module}-${cucumberConf.version}/node_modules/${cucumberConf.module}`
  );
};

module.exports.load = function() {
  const cucumberConf = process.env.MULTIDEP_CUCUMBER_CONF;

  if (cucumberConf) {
    const conf = JSON.parse(cucumberConf);
    return require('multidep')('test/multidep.js')(conf.module, conf.version);
  } else {
    return requireOrElse('@cucumber/cucumber', 'cucumber');
  }
};

module.exports.majorVersion = function() {

  const cucumberConf = process.env.MULTIDEP_CUCUMBER_CONF;

  const version = cucumberConf
    ? JSON.parse(cucumberConf).version
    : requireOrElse('@cucumber/cucumber/package.json', 'cucumber/package.json').version;

  return majorVersionFrom(version);
};

function majorVersionFrom(version) {
  return +version.split('.')[0];
}

function requireOrElse(preferredModule, alternativeModule) {
  try {
    return require(preferredModule);
  } catch(e) {
    return require(alternativeModule);
  }
}
