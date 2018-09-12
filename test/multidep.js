let path = require('path');
let conf = require(path.join(__dirname, '..', 'package.json')).cucumberConf;

module.exports = {
  path: 'test/multidep_modules',
  versions: {
    cucumber: [
      conf.version1,
      conf.version2,
      conf.version3,
      conf.version4,
      conf.version5
    ]
  }
};
