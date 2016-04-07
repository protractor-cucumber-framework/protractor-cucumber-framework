#!/usr/bin/env node

/* eslint no-console: 0 */

let child_process = require('child_process');
let fs = require('fs');
let path = require('path');
let q = require('q');

let cucumberConf = require(path.join(__dirname, '..', 'package.json')).cucumberConf;

let CommandlineTest = function(command) {
  let self = this;
  this.command_ = command;
  this.callback_ = false;
  this.expectedExitCode_ = 0;
  this.stdioOnlyOnFailures_ = true;
  this.expectedErrors_ = [];
  this.assertExitCodeOnly_ = false;
  this.expectedOutput_ = [];
  this.cucumberVesion_ = cucumberConf.version1;

  this.cucumberVersion2 = function() {
    self.cucumberVesion_ = cucumberConf.version2;
    return self;
  };

  // If stdioOnlyOnFailures_ is true, do not stream stdio unless test failed.
  // This is to prevent tests with expected failures from polluting the output.
  this.alwaysEnableStdio = function() {
    self.stdioOnlyOnFailures_ = false;
    return self;
  };

  // Only assert the exit code and not failures.
  // This must be true if the command you're running does not support
  //   the flag '--resultJsonOutputFile'.
  this.assertExitCodeOnly = function() {
    self.assertExitCodeOnly_ = true;
    return self;
  };

  // Set the expected exit code for the test command.
  this.expectExitCode = function(exitCode) {
    self.expectedExitCode_ = exitCode;
    return self;
  };

  this.then = function(callback) {
    self.callback_ = callback;
    return self;
  };

  // Set the expected total test duration in milliseconds.
  this.expectTestDuration = function(min, max) {
    self.expectedMinTestDuration_ = min;
    self.expectedMaxTestDuration_ = max;
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

  this.run = function() {
    process.env.MULTIDEP_CUCUMBER_VERSION = self.cucumberVesion_;

    let start = new Date().getTime();
    let testOutputPath = 'test_output_' + start + '.tmp';
    let output = '';

    let flushAndFail = function(errorMsg) {
      process.stdout.write(output);
      throw new Error(errorMsg);
    };

    return q.promise(function(resolve, reject) {
      if (!self.assertExitCodeOnly_) {
        self.command_ = self.command_ + ' --resultJsonOutputFile ' + testOutputPath;
      }
      let args = self.command_.split(/\s/);

      let test_process;

      if (self.stdioOnlyOnFailures_) {
        test_process = child_process.spawn(args[0], args.slice(1));

        test_process.stdout.on('data', function(data) {
          output += data;
        });

        test_process.stderr.on('data', function(data) {
          output += data;
        });
      } else {
        test_process = child_process.spawn(args[0], args.slice(1), {stdio: 'inherit'});
      }

      test_process.on('error', function(err) {
        reject(err);
      });

      test_process.on('exit', function(exitCode) {
        resolve(exitCode);
      });
    }).then(function(exitCode) {
      if (self.expectedExitCode_ !== exitCode) {
        flushAndFail('expecting exit code: ' + self.expectedExitCode_ +
              ', actual: ' + exitCode);
      }

      // Skip the rest if we are only verify exit code.
      // Note: we're expecting a file populated by '--resultJsonOutputFile' after
      //   this point.
      if (self.assertExitCodeOnly_) {
        return;
      }

      let testOutput;

      if (fs.existsSync(testOutputPath)) {
        let raw_data = fs.readFileSync(testOutputPath);
        testOutput = JSON.parse(raw_data);
      } else {
        testOutput = [];
      }

      let actualErrors = [];
      let duration = 0;
      testOutput.forEach(function(specResult) {
        duration += specResult.duration;
        specResult.assertions.forEach(function(assertion) {
          if (!assertion.passed) {
            actualErrors.push(assertion);
          }
        });
      });

      self.expectedErrors_.forEach(function(expectedError) {
        let found = false;
        for (var i = 0; i < actualErrors.length; ++i) {
          let actualError = actualErrors[i];

          // if expected message is defined and messages don't match
          if (expectedError.message) {
            if (!actualError.errorMsg || !actualError.errorMsg.match(new RegExp(expectedError.message))) {
              continue;
            }
          }
          // if expected stackTrace is defined and stackTraces don't match
          if (expectedError.stackTrace) {
            if (!actualError.stackTrace || !actualError.stackTrace.match(new RegExp(expectedError.stackTrace))) {
              continue;
            }
          }
          found = true;
          break;
        }

        if (!found) {
          if (expectedError.message && expectedError.stackTrace) {
            flushAndFail('did not fail with expected error with message: [' +
              expectedError.message + '] and stackTrace: [' +
              expectedError.stackTrace + ']');
          } else if (expectedError.message) {
            flushAndFail('did not fail with expected error with message: [' +
              expectedError.message + ']');
          } else if (expectedError.stackTrace) {
            flushAndFail('did not fail with expected error with stackTrace: [' +
              expectedError.stackTrace + ']');
          }
        } else {
          actualErrors.splice(i, 1);
        }
      });

      self.expectedOutput_.forEach(function(out) {
        if (output.indexOf(out) < 0) {
          flushAndFail('expecting output `' + out + '`' + ' in `' + output + '`');
        }
      });

      if (actualErrors.length > 0) {
        flushAndFail('failed with ' + actualErrors.length + ' unexpected failures');
      }

      if (self.expectedMinTestDuration_ && duration < self.expectedMinTestDuration_) {
        flushAndFail('expecting test min duration: ' + self.expectedMinTestDuration_ + ', actual: ' + duration);
      }

      if (self.expectedMaxTestDuration_ && duration > self.expectedMaxTestDuration_) {
        flushAndFail('expecting test max duration: ' + self.expectedMaxTestDuration_ + ', actual: ' + duration);
      }

      if (self.callback_) {
        self.callback_();
      }
    }).fin(function() {
      try {
        fs.unlinkSync(testOutputPath);
      } catch (err) {
        // don't do anything
      }
    });
  };
};

/**
 * Util for running tests and testing functionalities including:
 *   exitCode, test durations, expected errors, and expected stackTrace
 * Note, this will work with any commandline tests, but only if it supports
 *   the flag '--resultJsonOutputFile', unless only exitCode is being tested.
 *   For now, this means protractor tests (jasmine/mocha/cucumber).
 */
exports.Executor = function() {
  let tests = [];
  this.addCommandlineTest = function(command) {
    let test = new CommandlineTest(command);
    tests.push(test);
    return test;
  };

  this.execute = function() {
    let failed = false;

    (function runTests(i) {
      if (i < tests.length) {
        console.log('running: ' + tests[i].command_);
        tests[i].run().then(function() {
          console.log('>>> \x1B[1;32mpass\x1B[0m');
        }, function(err) {
          failed = true;
          console.log('>>> \x1B[1;31mfail: ' + err.toString() + '\x1B[0m');
        }).fin(function() {
          runTests(i + 1);
        }).done();
      } else {
        console.log('Summary: ' + (failed ? 'fail' : 'pass'));
        process.exit(failed ? 1 : 0);
      }
    }(0));
  };
};
