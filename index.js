var q = require('q'),
    path = require('path'),
    glob = require('glob'),
    assign = require('object-assign'),
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
  var results = {};

  return runner.runTestPreparer().then(function() {
    var config = runner.getConfig();
    var opts = assign({}, config.cucumberOpts, config.capabilities.cucumberOpts);
    state.initialize(runner, results, opts.strict);

    return q.promise(function(resolve, reject) {
      var cliArguments = convertOptionsToCliArguments(opts);
      cliArguments.push('--require', path.resolve(__dirname, 'lib', 'resultsCapturer.js'));
      cliArguments = cliArguments.concat(specs);

      debug('cucumber command: "' + cliArguments.join(' ') + '"');

      Cucumber.Cli(cliArguments).run(function (isSuccessful) {
        try {
          var complete = q();
          if (runner.getConfig().onComplete) {
            complete = q(runner.getConfig().onComplete());
          }
          complete.then(function() {
            resolve(results);
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  function convertOptionsToCliArguments(options) {
    var cliArguments = ['node', 'cucumberjs'];
    var config = runner.getConfig();

    for (var option in options) {
      var cliArgumentValues = convertOptionValueToCliValues(option, options[option]);

      if (Array.isArray(cliArgumentValues)) {
        cliArgumentValues.forEach(function (value) {
          if (config.capabilities.shardTestFiles) {
            if (option == 'format') {
              var parts = value.split(':');
              if (typeof(parts[1]) !== 'undefined') {
                var splitFilename = parts[1].split('.');
                var splitFilenameLength = splitFilename.length;
                var uuid = guid();
                if (splitFilenameLength > 1) {
                  splitFilename.splice(splitFilenameLength-1, 0, uuid);
                  parts[1] = splitFilename.join('.');
                } else {
                  parts[1] = parts[1] + '-' + uuid;
                }
                value = parts.join(':');
              }
            }
          }
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
      return path.resolve(configDir, requirePath);
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
