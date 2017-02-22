var path = require('path');
var cucumberConf = require(path.join(__dirname, '..', 'package.json')).cucumberConf;

module.exports = {
  path: 'spec/multidep_modules',
  versions: {
    cucumber: [cucumberConf.version1, cucumberConf.version2]
  }
};
