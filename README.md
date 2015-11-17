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
  frameworkPath: 'protractor-cucumber-framework'
};
```
