Protractor Cucumber Framework
=============================

[![Build Status](https://travis-ci.org/protractor-cucumber-framework/protractor-cucumber-framework.svg?branch=master)](https://travis-ci.org/protractor-cucumber-framework/protractor-cucumber-framework)

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
  strick: true,
  'no-colors': true,
  format: ['progress', 'pretty:output.txt'],
  // ...
}
```

The following parameters have special behavior:

 * `require` - globs will be expanded to multiple `--require` arguments

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

