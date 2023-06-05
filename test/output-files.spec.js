let {expect} = require('chai');
let fs = require('fs');
let glob = require('glob');
let path = require('path');

let util = require('./test_util');
let LOG_FILE_LOCATION = path.resolve(__dirname);
let LOG_FILE_NAME = 'protractor-cucumber-framework-test';
let LOG_FILE_PREFIX = `${LOG_FILE_LOCATION}/${LOG_FILE_NAME}`;

describe('output files', () => {
  beforeEach(cleanupLogFiles);
  afterEach(cleanupLogFiles);

  it('should not add a unique identifier when not needed', () => {
    let cmd = `test/cucumber/conf/cucumber1Conf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`;

    return util
      .runOne(cmd)
      .expectExitCode(0)
      .after(() => {
        let logFiles = findLogFiles();
        expect(logFiles).to.have.length(1);
        expect(logFiles[0]).to.match(new RegExp(`${LOG_FILE_PREFIX}.json`));
      })
      .run();
  });

  it('should add unique identifier when sharded', () => {
    let cmd = `test/cucumber/conf/cucumber1Conf.js --capabilities.shardTestFiles true --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`;

    return util
      .runOne(cmd)
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(5)) //note: this will increase for every feature file we have
      .run();
  });

  it('should add unique identifier when running multiCapabilities', () => {
    let cmd = `test/cucumber/conf/cucumber1MultiConf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`;

    return util
      .runOne(cmd)
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(2))
      .run();
  });

  it('should add unique identifier when multiCapabilities is a function', () => {
    let cmd = `test/cucumber/conf/cucumber1GetMultiConf.js --cucumberOpts.format json:${LOG_FILE_PREFIX}.json`;

    return util
      .runOne(cmd)
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(2))
      .run();
  });

  it('should handle custom formatters', () => {
    let cmd = `test/cucumber/conf/cucumber2Conf.js --capabilities.shardTestFiles true --cucumberOpts.format ${LOG_FILE_LOCATION}/cucumber/formatters/custom.js:${LOG_FILE_PREFIX}.json`;

    return util
      .runOne(cmd)
      .cucumberVersion2()
      .expectExitCode(0)
      .after(() => expect(findLogFiles()).to.have.length(5))
      .run();
  });

  it('should handle relative paths with cucumber 3', () => {
    let cmd = `test/cucumber/conf/cucumber3Conf.js --cucumberOpts.tags @cucumber3 --cucumberOpts.format json:../${LOG_FILE_NAME}.json`;
    let cucumberConf = require('../package.json').cucumberConf.version3;
    let cwd = path.join(
      __dirname,
      `multidep_modules/${cucumberConf.module}-${cucumberConf.version}`
    );

    return util
      .runOne(cmd)
      .cucumberVersion3()
      .expectExitCode(0)
      .after(() => {
        let logFiles = findLogFiles(`${cwd}/../${LOG_FILE_NAME}.json`);
        expect(logFiles).to.have.length(1);
        expect(logFiles[0]).to.match(new RegExp(`${LOG_FILE_NAME}*.json`));
      })
      .run();
  });

  function cleanupLogFiles() {
    findLogFiles().forEach(fs.unlinkSync);
  }

  function findLogFiles(pattern) {
    return glob.sync(pattern || `${LOG_FILE_PREFIX}*.json`);
  }
});
