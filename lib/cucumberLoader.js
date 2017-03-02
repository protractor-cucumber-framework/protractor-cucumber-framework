module.exports.load = function() {
  if (process.env.MULTIDEP_CUCUMBER_VERSION) {
    return require('multidep')('test/multidep.js')('cucumber', process.env.MULTIDEP_CUCUMBER_VERSION);
  } else {
    return require('cucumber');
  }
};
