var q = require('q'),
    path = require('path'),
    glob = require('glob'),
    Cucumber = require('cucumber');

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  var results = {}
  require('./lib/runState').initialize(runner, results);

  return runner.runTestPreparer().then(function() {
    return q.promise(function(resolve, reject) {
      var cliArguments = convertOptionsToCliArguments(runner.getConfig().cucumberOpts);
      cliArguments.push('--require', path.resolve(__dirname, 'lib', 'resultsCapturer.js'));
      cliArguments = cliArguments.concat(specs);

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

      if (cliArgumentValues === true) {
        cliArguments.push('--' + option);
      } else if (cliArgumentValues.length) {
        cliArgumentValues.forEach(function (value) {
          cliArguments.push('--' + option, value);
        });
      }
    }

    return cliArguments;
  }

  function convertRequireOptionValuesToCliValues(values) {
    var configDir = runner.getConfig().configDir;

    return values.map(function(path) {
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
    if (values[0] === true) {
      return values[0]
    } else {
      return values;
    }
  }

  function convertOptionValueToCliValues(option, values) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    if (option === 'require') {
      return convertRequireOptionValuesToCliValues(values);
    } else {
      return convertGenericOptionValuesToCliValues(values);
    }
  }
};
