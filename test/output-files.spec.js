let {expect} = require('chai');
let fs = require('fs');
let glob = require('glob');

let util = require('./test_util');
let LOG_FILE_PREFIX = 'protractor-cucumber-framework-test';

describe('output files', function() {
  beforeEach(cleanupLogFiles);
  afterEach(cleanupLogFiles);

  it('should not add a unique identifier when not needed', function() {
    return util.runOne(`test/cucumber/conf/cucumber1Conf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`)
      .expectExitCode(0)
      .after(function() {
        let logFiles = findLogFiles();
        expect(logFiles).to.have.length(1);
        expect(logFiles[0]).to.match(new RegExp(`${LOG_FILE_PREFIX}\.json`));
      })
      .run();
  });

  it('should add unique identifier when sharded', function() {
    return util.runOne(`test/cucumber/conf/cucumber1Conf.js --capabilities.shardTestFiles true --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`)
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(3)) //note: this will increase for every feature file we have
      .run();
  });

  it('should add unique identifier when running multiCapabilities', function() {
    return util.runOne(`test/cucumber/conf/cucumber1MultiConf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`)
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(2))
      .run();
  });

  it('should add unique identifier when multiCapabilities is a function', function() {
    return util.runOne(`test/cucumber/conf/cucumber1GetMultiConf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`)
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(2))
      .run();
  });

  function cleanupLogFiles() {
    findLogFiles().forEach(fs.unlinkSync);
  }

  function findLogFiles() {
    return glob.sync(`./${LOG_FILE_PREFIX}*.json`);
  }
});
