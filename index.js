let debug = require('debug')('protractor-cucumber-framework');
let glob = require('glob');
let path = require('path');
let q = require('q');
let tmp = require('tmp');

let cucumberLoader = require('./lib/cucumberLoader');
let Cucumber = cucumberLoader.load();
let cucumberVersion = cucumberLoader.majorVersion();
let cwd = cucumberLoader.cwd();
let state = require('./lib/runState');

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  let results = {};

  return runner.runTestPreparer().then(function() {
    let config = runner.getConfig();
    let opts = Object.assign(
      {},
      config.cucumberOpts,
      config.capabilities.cucumberOpts
    );
    state.initialize(runner, results, opts.strict);

    return q.promise(function(resolve, reject) {
      let cliArguments = convertOptionsToCliArguments(opts);
      let capturer = path.resolve(__dirname, 'lib', 'resultsCapturer.js');

      if (cucumberVersion < 3) {
        cliArguments.push('--require', capturer);
      } else {
        let tempFile = tmp.fileSync();
        cliArguments.push('--format', `${capturer}:${tempFile.name}`);
      }

      if (opts.rerun) {
        cliArguments.push(opts.rerun);
      } else {
        cliArguments = cliArguments.concat(specs);
      }

      debug('cucumber command: "' + cliArguments.join(' ') + '"');

      if (cucumberVersion >= 2) {
        let cli = new Cucumber.Cli({
          argv: cliArguments,
          cwd,
          stdout: process.stdout
        });

        cli.run().then(runDone);
      } else {
        Cucumber.Cli(cliArguments).run(runDone);
      }

      function runDone() {
        try {
          let complete = q();

          if (runner.getConfig().onComplete) {
            complete = q(runner.getConfig().onComplete());
          }

          complete.then(() => resolve(results));
        } catch (err) {
          reject(err);
        }
      }
    });
  });

  function convertOptionsToCliArguments(options) {
    let cliArguments = ['node', 'cucumberjs'];

    for (let option in options) {
      if (option === 'rerun') continue;
      let cliArgumentValues = convertOptionValueToCliValues(
        option,
        options[option]
      );

      if (Array.isArray(cliArgumentValues)) {
        cliArgumentValues.forEach(value =>
          cliArguments.push('--' + option, value)
        );
      } else if (cliArgumentValues) {
        cliArguments.push('--' + option);
      }
    }

    return cliArguments;
  }

  function convertRequireOptionValuesToCliValues(values) {
    let configDir = runner.getConfig().configDir;

    return toArray(values)
      .map(path => glob.sync(path, {cwd: configDir})) // Handle glob matching
      .reduce((opts, globPaths) => opts.concat(globPaths), []) // Combine paths into flattened array
      .map(requirePath => path.resolve(configDir, requirePath)) // Resolve require absolute path
      .filter((item, pos, orig) => orig.indexOf(item) == pos); // Make sure requires are unique
  }

  function convertTagsToV2CliValues(values) {
    let converted = toArray(values)
      .filter(tag => !!tag.replace)
      .map(tag => tag.replace(/~/, 'not '))
      .join(' and ');

    return converted ? [converted] : '';
  }

  function makeFormatPathsUnique(values) {
    return toArray(values).map(function(format) {
      let formatPathMatch = format.match(/(.+):(.+)/);
      if (!formatPathMatch) return format;

      let pathParts = formatPathMatch[2].split('.');
      pathParts.splice(pathParts.length - 1 || 1, 0, process.pid);
      return `${formatPathMatch[1]}:${pathParts.join('.')}`;
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
    } else if (option === 'tags' && cucumberVersion >= 2) {
      return convertTagsToV2CliValues(values);
    } else if (option === 'format' && areUniquePathsRequired()) {
      return makeFormatPathsUnique(values);
    } else {
      return convertGenericOptionValuesToCliValues(values);
    }
  }

  function areUniquePathsRequired() {
    let config = runner.getConfig();

    return (
      (Array.isArray(config.multiCapabilities) &&
        config.multiCapabilities.length > 0) ||
      typeof config.getMultiCapabilities === 'function' ||
      config.capabilities.shardTestFiles
    );
  }

  function toArray(values) {
    return Array.isArray(values) ? values : [values];
  }
};
