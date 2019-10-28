#!/usr/bin/env node

let child_process = require('child_process');
let fs = require('fs');
let path = require('path');
let q = require('q');
let chai = require('chai');
let chaiLike = require('chai-like');

chaiLike.extend({
  match: (object, expected) =>
    typeof object === 'string' && expected instanceof RegExp,
  assert: (object, expected) => expected.test(object)
});

chai.use(chaiLike);

let cucumberConf = require(path.join(__dirname, '..', 'package.json'))
  .cucumberConf;

let CommandlineTest = function(cucumberVersion, args) {
  let self = this;
  this.args_ = Array.isArray(args) ? args : args.split(/\s/);
  this.before_ = false;
  this.after_ = false;
  this.expectedExitCode_ = 0;
  this.verbose_ = false;
  this.debug_ = false;
  this.expectedErrors_ = [];
  this.expectedOutput_ = [];
  this.expectedEvents_ = [];

  switch (cucumberVersion) {
    case 1:
      this.cucumberVersion_ = cucumberConf.version1;
      break;

    case 2:
      this.cucumberVersion_ = cucumberConf.version2;
      break;

    case 3:
      this.cucumberVersion_ = cucumberConf.version3;
      break;

    case 4:
      this.cucumberVersion_ = cucumberConf.version4;
      break;

    case 5:
      this.cucumberVersion_ = cucumberConf.version5;
      break;

    case 6:
      this.cucumberVersion_ = cucumberConf.version6;
      break;

    default:
      throw new Error(`Cucumber ${cucumberVersion} not supported`);
  }

  this.cucumberVersion2 = function() {
    self.cucumberVersion_ = cucumberConf.version2;
    return self;
  };

  this.cucumberVersion3 = function() {
    self.cucumberVersion_ = cucumberConf.version3;
    return self;
  };

  this.cucumberVersion4 = function() {
    self.cucumberVersion_ = cucumberConf.version4;
    return self;
  };

  this.cucumberVersion5 = function() {
    self.cucumberVersion_ = cucumberConf.version5;
    return self;
  };

  this.cucumberVersion6 = function() {
    self.cucumberVersion_ = cucumberConf.version6;
    return self;
  };

  this.expectSuccessfulRun = function(expectedOutput) {
    this.expectExitCode(0);
    this.expectErrors([]);
    if (expectedOutput) this.expectOutput(expectedOutput);
    return self;
  };

  this.expectExitCode = function(exitCode) {
    self.expectedExitCode_ = exitCode;
    return self;
  };

  this.before = function(callback) {
    self.before_ = callback;
    return self;
  };

  this.after = function(callback) {
    self.after_ = callback;
    return self;
  };

  this.verbose = function() {
    self.verbose_ = true;
    return self;
  };

  this.debug = function() {
    self.debug_ = true;
    return self;
  };

  /**
   * Add expected error(s) for the test command.
   * Input is an object or list of objects of the following form:
   * {
   *   message: string, // optional regex
   *   stackTrace: string, //optional regex
   * }
   */
  this.expectErrors = function(expectedErrors) {
    if (expectedErrors instanceof Array) {
      self.expectedErrors_ = self.expectedErrors_.concat(expectedErrors);
    } else {
      self.expectedErrors_.push(expectedErrors);
    }
    return self;
  };

  this.expectOutput = function(output) {
    self.expectedOutput_.push(output);
    return self;
  };

  this.expectEvents = function(expectedEvents) {
    self.expectedEvents_ = self.expectedEvents_.concat(expectedEvents);
    return self;
  };

  this.run = function() {
    process.env.MULTIDEP_CUCUMBER_VERSION = self.cucumberVersion_;

    let start = new Date().getTime();
    let testOutputPath = 'test_output_' + start + '.tmp';
    let output = '';

    let flushAndFail = function(errorMsg) {
      process.stdout.write(output);
      throw new Error(errorMsg);
    };

    return q
      .promise(function(resolve, reject) {
        if (self.before_) self.before_();

        const cmd = 'node';
        const args = [
          'node_modules/protractor/bin/protractor',
          '--resultJsonOutputFile',
          testOutputPath
        ].concat(self.args_);

        let test_process;

        if (self.verbose_) {
          test_process = child_process.spawn(cmd, args, {
            stdio: 'inherit'
          });
        } else {
          test_process = child_process.spawn(cmd, args);
          test_process.stdout.on('data', data => (output += data));
          test_process.stderr.on('data', data => (output += data));
        }

        test_process.on('error', err => reject(err));
        test_process.on('exit', exitCode => resolve(exitCode));
      })
      .then(function(exitCode) {
        if (self.debug_) {
          console.log(output); // eslint-disable-line
        }

        if (self.expectedExitCode_ !== exitCode) {
          flushAndFail(
            `expecting exit code: ${
              self.expectedExitCode_
            }, actual: ${exitCode}`
          );
        }

        let testOutput;

        if (fs.existsSync(testOutputPath)) {
          let raw_data = fs.readFileSync(testOutputPath);
          testOutput = JSON.parse(raw_data);
        } else {
          testOutput = [];
        }

        let actualErrors = [];
        let actualEvents = [];

        testOutput.forEach(function(specResult) {
          actualEvents = actualEvents.concat(specResult.events);

          specResult.assertions.forEach(function(assertion) {
            if (!assertion.passed) actualErrors.push(assertion);
          });
        });

        chai.expect(actualEvents).to.be.like(self.expectedEvents_);

        self.expectedErrors_.forEach(function(expectedError) {
          let found = false;

          for (var i = 0; i < actualErrors.length; ++i) {
            let actualError = actualErrors[i];

            // if expected message is defined and messages don't match
            if (expectedError.message) {
              if (
                !actualError.errorMsg ||
                !actualError.errorMsg.match(new RegExp(expectedError.message))
              ) {
                continue;
              }
            }

            // if expected stackTrace is defined and stackTraces don't match
            if (expectedError.stackTrace) {
              if (
                !actualError.stackTrace ||
                !actualError.stackTrace.match(
                  new RegExp(expectedError.stackTrace)
                )
              ) {
                continue;
              }
            }

            found = true;
            break;
          }

          if (!found) {
            if (expectedError.message && expectedError.stackTrace) {
              flushAndFail(
                'did not fail with expected error with message: [' +
                  expectedError.message +
                  '] and stackTrace: [' +
                  expectedError.stackTrace +
                  ']'
              );
            } else if (expectedError.message) {
              flushAndFail(
                'did not fail with expected error with message: [' +
                  expectedError.message +
                  ']'
              );
            } else if (expectedError.stackTrace) {
              flushAndFail(
                'did not fail with expected error with stackTrace: [' +
                  expectedError.stackTrace +
                  ']'
              );
            }
          } else {
            actualErrors.splice(i, 1);
          }
        });

        self.expectedOutput_.forEach(function(out) {
          if (output.indexOf(out) < 0) {
            flushAndFail(
              'expecting output `' + out + '`' + ' in `' + output + '`'
            );
          }
        });

        if (actualErrors.length > 0) {
          flushAndFail(
            'failed with ' + actualErrors.length + ' unexpected failures'
          );
        }

        if (self.after_) self.after_();
        if (self.then_) self.then_();
      })
      .fin(function() {
        try {
          fs.unlinkSync(testOutputPath);
        } catch (err) {
          // don't do anything
        }
      });
  };
};

function runOne(cucumberVersion, args) {
  return new CommandlineTest(cucumberVersion, args);
}

module.exports = {
  runOne: runOne.bind(null, 1),
  testCucumber1: runOne.bind(null, 1),
  testCucumber2: runOne.bind(null, 2),
  testCucumber3: runOne.bind(null, 3),
  testCucumber4: runOne.bind(null, 4),
  testCucumber5: runOne.bind(null, 5),
  testCucumber6: runOne.bind(null, 6)
};
