Protractor Cucumber Framework
=============================

[![npm-version](https://img.shields.io/npm/v/protractor-cucumber-framework.svg)](https://www.npmjs.com/package/protractor-cucumber-framework)
[![Join the chat at https://gitter.im/protractor-cucumber-framework/protractor-cucumber-framework](https://badges.gitter.im/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://gitter.im/protractor-cucumber-framework/protractor-cucumber-framework?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/workflows/build/badge.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/actions)
[![dependencies](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework/status.svg)](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework)
[![dev dependencies](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework/dev-status.svg)](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework?type=dev)
[![peer dependencies](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework/peer-status.svg)](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework?type=peer)
![download-count](https://img.shields.io/npm/dm/protractor-cucumber-framework.svg)
[![open-issues](https://img.shields.io/github/issues/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/issues)
[![contributors](https://img.shields.io/github/contributors/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/graphs/contributors)

This framework was originally part of [angular/protractor](https://github.com/angular/protractor) and
is now a separate module to decouple [cucumber.js](https://github.com/cucumber/cucumber-js).

The project relies on [Serenity/JS](https://serenity-js.org) to enable integration between Protractor and Cucumber 1.x - 7.x and offer support for both [Cucumber.js-native](https://cucumber.io/docs/cucumber/reporting/) and [Serenity/JS reporters](https://serenity-js.org/handbook/reporting/index.html).

To see Serenity/JS reports in action, check out the [demo project](https://github.com/jan-molak/protractor-cucumber-framework-demo) and the [reports](https://jan-molak.github.io/protractor-cucumber-framework-demo/) it produces.

Install
-------

To install this module, run the following command in your computer terminal:

```
npm install --save-dev protractor-cucumber-framework
```

Please note that to use `protractor-cucumber-framework` you'll need a recent [Long-Term Support](https://nodejs.org/en/about/releases/) versions of Node.js, so **12**, **14**, or **16**.

Odd-numbered Node.js releases (11, 13, 15, etc.) are not on the LTS line, should be considered experimental, and should not be used in production.

Implementation
--------------

To implement this framework, utilize the `protractor` custom framework config option:

```js
exports.config = {
  // set to "custom" instead of cucumber.
  framework: 'custom',

  // path relative to the current config file
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  // require feature files
  specs: [
    'path/to/feature/files/**/*.feature' // accepts a glob
  ],

  cucumberOpts: {
    // require step definitions
    require: [
      'path/to/step/definitions/**/*.steps.js' // accepts a glob
    ]
  }
};
```

To configure [Serenity/JS reporting services](https://serenity-js.org/handbook/reporting/index.html),
check out the [demo project](https://github.com/serenity-js/protractor-cucumber-framework-demo)
and consult the [Serenity/JS Handbook](https://serenity-js.org/handbook/integration/serenityjs-and-protractor.html#integrating-protractor-with-serenity-js-and-cucumber).

#### Passing Options to Cucumber.js

All of the `cucumberOpts` will be passed to `cucumberjs` as arguments.

For example, to call cucumberjs with the `--strict`, `--no-colors`, and to specify custom formatters:

```js
cucumberOpts: {
  strict: true,
  'no-colors': true,
  format: ['progress', 'pretty:output.txt'],
  // ...
}
```

The following parameters have special behavior:

 * `require` - globs will be expanded to multiple `--require` arguments
 * `rerun` - value is passed as an argument; for use with the [rerun feature](https://github.com/cucumber/cucumber-js/blob/master/features/rerun_formatter.feature)

#### Formatters when tests are sharded or with multi capabilities

If you have a formatter that outputs to a path and your tests are sharded or you have multi
capabilities then this library will add the PID to the path to make them unique. The reason for
this is multiple processes can write to the same path which ends up clobbering each other.
You'll end up with 1 file per process that protractor spawns.

```js
exports.config = {
  capabilities: {
    shardTestFiles: true,
    // ...
  },

  cucumberOpts: {
    format: 'json:results.json',
    // ...
  }
};
```

If there were 2 feature files then you can expect the following output files...
```
  results.11111.json
  results.22222.json
```
...where the numbers will be the actual PIDs.


#### Uncaught Exceptions

If your process abruptly stops with an exit code `199` then your steps most likely threw an uncaught
exception. Protractor is capturing these and exiting the process in this situation. The solution is
to upgrade to at least protractor version 4.0.10 and add the following to your protractor conf...

```
  ignoreUncaughtExceptions: true
```

This allows cucumber to handle the exception and record it appropriately.

Contributing
------------

Pull requests are welcome. Commits should have an appropriate message and be squashed.

For Contributors
----------------
Ensure that the following dependencies are installed:

 * Java SDK and JRE
 * Node.js
 * Google Chrome

Clone the github repository:

    git clone https://github.com/protractor-cucumber-framework/protractor-cucumber-framework
    cd protractor-cucumber-framework
    npm install

#### Testing

Start a selenium server:

    npm run webdriver

Start the test app that tests will be run against in a separate shell:

    npm start

Run the tests in a separate shell:

    npm test

For Maintainers
---------------

#### Releasing

1. bump version
1. `npm publish`
1. tag release (`git tag vx.x.x && git push origin master --tags`)
1. build github release (`npx release`)

