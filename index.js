const debug = require('debug')('protractor-cucumber-framework');
const glob = require('glob');
const path = require('path');
const q = require('q');
const tmp = require('tmp');

const cucumberLoader = require('./lib/cucumberLoader');
const Cucumber = cucumberLoader.load();
const cucumberVersion = cucumberLoader.majorVersion();
const cwd = cucumberLoader.cwd();
const state = require('./lib/runState');
const extraFlags = ['cucumberOpts'];

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  return runner.runTestPreparer(extraFlags).then(() => {
    const results = {};
    const config = runner.getConfig();
    const opts = Object.assign(
      {},
      config.cucumberOpts,
      config.capabilities.cucumberOpts
    );
    const cliArgs = buildCliArgsFrom(opts);

    state.initialize(runner, results, opts.strict, opts.retry);

    return q.promise(function(resolve, reject) {
      runCucumber(cliArgs, error => {
        if (error instanceof Error) {
          return reject(error);
        }
        try {
          let complete = q();

          if (runner.getConfig().onComplete) {
            complete = q(runner.getConfig().onComplete());
          }

          complete.then(() => resolve(results));
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  function runCucumber(argv, done) {
    debug('cucumber command: "' + argv.join(' ') + '"');

    if (cucumberVersion >= 2) {
      let cli = new Cucumber.Cli({
        argv: argv,
        cwd,
        stdout: process.stdout
      });

      return cli
        .run()
        .then(done)
        .catch(done);
    } else {
      Cucumber.Cli(argv).run(done);
    }
  }

  function buildCliArgsFrom(opts) {
    let argv = convertOptionsToCliArgs(opts);
    let capturer = path.resolve(__dirname, 'lib', 'resultsCapturer.js');

    if (cucumberVersion < 3) {
      argv.push('--require', capturer);
    } else {
      let tempFile = tmp.fileSync();
      argv.push('--format', `${capturer}:${tempFile.name}`);
    }

    if (opts.rerun) {
      argv.push(opts.rerun);
    } else {
      argv = argv.concat(specs);
    }

    return argv;
  }

  function convertOptionsToCliArgs(options) {
    let argv = ['node', 'cucumberjs'];

    for (let option in options) {
      if (option === 'rerun') continue;

      let cliArgumentValues = convertOptionValueToCliValues(
        option,
        options[option]
      );

      if (Array.isArray(cliArgumentValues)) {
        cliArgumentValues.forEach(value => argv.push('--' + option, value));
      } else if (cliArgumentValues) {
        argv.push('--' + option);
      }
    }

    return argv;
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
      let formatPathMatch = format.match(/(..+):(.+)/);
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
