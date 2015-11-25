Protractor Cucumber Framework
=============================

[![Build Status](https://travis-ci.org/mattfritz/protractor-cucumber-framework.svg?branch=master)](https://travis-ci.org/mattfritz/protractor-cucumber-framework)

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
  frameworkPath: require.resolve('protractor-cucumber-framework')
};
```

Contributing
------------

Pull requests are welcome. Commits should have an appropriate message and be squashed.

For Contributors
----------------
Clone the github repository:

    git clone https://github.com/mattfritz/protractor-cucumber-framework
    cd protractor-cucumber-framework
    npm install

Start up a selenium server. By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`. A selenium server can be started with `webdriver-manager`.

    node_modules/.bin/webdriver-manager update --standalone
    node_modules/.bin/webdriver-manager start

The test suite runs against the included test application. Start that up with

    npm start

Then run the tests with

    npm test
