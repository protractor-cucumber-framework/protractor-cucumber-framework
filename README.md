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

Contributing
------------

Pull requests are welcome. Commits should have an appropriate message and be squashed.

For Contributors
----------------
Clone the github repository:

    git clone https://github.com/protractor-cucumber-framework/protractor-cucumber-framework
    cd protractor-cucumber-framework
    npm install

Start up a selenium server:

    npm run webdriver

Start up the test app that tests will be run against in a separate shell:

    npm start

Run the tests in a separate shell:

    npm test
