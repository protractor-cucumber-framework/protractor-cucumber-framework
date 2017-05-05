Protractor Cucumber Framework
=============================

[![npm-version](https://img.shields.io/npm/v/protractor-cucumber-framework.svg)](https://www.npmjs.com/package/protractor-cucumber-framework)
[![Join the chat at https://gitter.im/protractor-cucumber-framework/protractor-cucumber-framework](https://badges.gitter.im/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://gitter.im/protractor-cucumber-framework/protractor-cucumber-framework?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/protractor-cucumber-framework/protractor-cucumber-framework.svg?branch=master)](https://travis-ci.org/protractor-cucumber-framework/protractor-cucumber-framework)
[![dependencies](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework/status.svg)](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework)
[![dev dependencies](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework/dev-status.svg)](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework?type=dev)
[![peer dependencies](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework/peer-status.svg)](https://david-dm.org/protractor-cucumber-framework/protractor-cucumber-framework?type=peer)
![download-count](https://img.shields.io/npm/dm/protractor-cucumber-framework.svg)
[![open-issues](https://img.shields.io/github/issues/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/issues)
[![contributors](https://img.shields.io/github/contributors/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/graphs/contributors)


This framework was originally part of [angular/protractor](https://github.com/angular/protractor) and
is now a separate module to decouple [cucumber.js](https://github.com/cucumber/cucumber-js).

Install
-------

`npm install --save-dev protractor-cucumber-framework`

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

#### Passing Options to cucumberjs

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
 * node.js
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
1. tag release (`git tag v1.0.2 && git push origin master --tags`)
1. build github release (`npm i -g release && release`)

