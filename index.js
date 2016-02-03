var q = require('q'),
    path = require('path'),
    glob = require('glob'),
    lodash = require('lodash'),
    debug = require('debug')('protractor-cucumber-framework'),
    Cucumber = require('cucumber'),
    state = require('./lib/runState');

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  var results = {}

  return runner.runTestPreparer().then(function() {
    var opts,
        runnerConfig = runner.getConfig();

    if (runnerConfig.capabilities && typeof (runnerConfig.capabilities.cucumberOpts) === "object") {
        opts = lodash.merge(runnerConfig.cucumberOpts, runnerConfig.capabilities.cucumberOpts);
    } else {
        opts = runnerConfig.cucumberOpts;
    }

    state.initialize(runner, results, opts.strict);

    return q.promise(function(resolve, reject) {
      var cliArguments = convertOptionsToCliArguments(opts);
      cliArguments.push('--require', path.resolve(__dirname, 'lib', 'resultsCapturer.js'));
      cliArguments = cliArguments.concat(specs);

      debug('cucumber command: "' + cliArguments.join(' ') + '"');

      Cucumber.Cli(cliArguments).run(function (isSuccessful) {
        try {
          if (runner.getConfig().onComplete) {
            runner.getConfig().onComplete();
          }
          resolve(results);
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  function convertOptionsToCliArguments(options) {
    var cliArguments = ['node', 'cucumberjs'];

    for (var option in options) {
      var cliArgumentValues = convertOptionValueToCliValues(option, options[option]);

      if (Array.isArray(cliArgumentValues)) {
        cliArgumentValues.forEach(function (value) {
          cliArguments.push('--' + option, value);
        });
      } else if (cliArgumentValues) {
        cliArguments.push('--' + option);
      }
    }

    return cliArguments;
  }

  function convertRequireOptionValuesToCliValues(values) {
    var configDir = runner.getConfig().configDir;

    return toArray(values).map(function(path) {
      // Handle glob matching
      return glob.sync(path, {cwd: configDir});
    }).reduce(function(opts, globPaths) {
      // Combine paths into flattened array
      return opts.concat(globPaths);
    }, []).map(function(requirePath) {
      // Resolve require absolute path
      return path.resolve(configDir, requirePath)
    }).filter(function(item, pos, orig) {
      // Make sure requires are unique
      return orig.indexOf(item) == pos;
    });
  }

  function convertGenericOptionValuesToCliValues(values) {
    if (values === true || !values) {
      return values;
    } else {
      return toArray(values);
    }
  }

  function convertOptionValueToCliValues(option, values) {
    if (option === 'require') {
      return convertRequireOptionValuesToCliValues(values);
    } else {
      return convertGenericOptionValuesToCliValues(values);
    }
  }

  function toArray(values) {
    return Array.isArray(values) ? values : [values];
  }
};
