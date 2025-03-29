# Protractor Cucumber Framework

[![Follow Serenity/JS on LinkedIn](https://img.shields.io/badge/Follow-Serenity%2FJS%20-0077B5?logo=linkedin)](https://www.linkedin.com/company/serenity-js)
[![Watch Serenity/JS on YouTube](https://img.shields.io/badge/Watch-@serenity--js-E62117?logo=youtube)](https://www.youtube.com/@serenity-js)
[![Join Serenity/JS Community Chat](https://img.shields.io/badge/Chat-Serenity%2FJS%20Community-FBD30B?logo=matrix)](https://matrix.to/#/#serenity-js:gitter.im)
[![Support Serenity/JS on GitHub](https://img.shields.io/badge/Support-@serenity--js-703EC8?logo=github)](https://github.com/sponsors/serenity-js)

[![NPM Version](https://badge.fury.io/js/protractor-cucumber-framework.svg)](https://badge.fury.io/js/protractor-cucumber-framework)
[![Known Vulnerabilities](https://snyk.io/test/github/protractor-cucumber-framework/protractor-cucumber-framework/badge.svg)](https://snyk.io/test/github/protractor-cucumber-framework/protractor-cucumber-framework)
![download-count](https://img.shields.io/npm/dm/protractor-cucumber-framework.svg)
[![open-issues](https://img.shields.io/github/issues/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/issues)
[![contributors](https://img.shields.io/github/contributors/protractor-cucumber-framework/protractor-cucumber-framework.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/graphs/contributors)

[![Build Status](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/workflows/build/badge.svg)](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework/actions)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/protractor-cucumber-framework)](https://libraries.io/npm/protractor-cucumber-framework)
[![Serenity/JS on StackOverflow](https://img.shields.io/badge/stackoverflow-serenity--js-important?logo=stackoverflow)](https://stackoverflow.com/questions/tagged/serenity-js)

This framework was originally part of [angular/protractor](https://github.com/angular/protractor) and
is now a separate module to decouple [cucumber.js](https://github.com/cucumber/cucumber-js).

The project relies on [Serenity/JS](https://serenity-js.org) to enable integration between **Protractor** and **Cucumber
1.x - 11.x** and offer support for both [Cucumber.js-native](https://cucumber.io/docs/cucumber/reporting/)
and [Serenity/JS reporters](https://serenity-js.org/handbook/reporting/).

To see Serenity/JS reports in action, check out
the [reference implementation](https://github.com/serenity-js/protractor-cucumber-framework-demo) and
the [Serenity BDD reports](https://serenity-js.github.io/protractor-cucumber-framework-demo/) it produces.

Learn more:

- [Serenity/JS website](https://serenity-js.org)
- [Reference implementation](https://github.com/serenity-js/protractor-cucumber-framework-demo)
  with [Serenity BDD reports](https://serenity-js.github.io/protractor-cucumber-framework-demo/)
- [Cucumber.js docs](https://github.com/cucumber/cucumber-js)
- [Protractor docs](https://www.protractortest.org/#/)
- [Gherkin reference](https://cucumber.io/docs/gherkin/reference/)

> ### 📣 **Protractor has reached its end-of-life, migrate your tests to Serenity/JS** 💡
>
> [Serenity/JS](https://serenity-js.org) offers a smooth transition for your Protractor tests, allowing you to migrate
> them gradually to WebdriverIO or Playwright while ensuring your test suite continues to work.
> 
> Learn more about [migrating from Protractor to Serenity/JS](https://serenity-js.org/handbook/getting-started/serenity-js-with-protractor/?pk_campaign=protractor_migration&pk_source=protractor-cucumber-framework#migrating-from-protractor-to-serenityjs)
> and [chat with the Serenity/JS community](https://matrix.to/#/#serenity-js:gitter.im) if you have any questions about the migration.

## Installation

To install this module, run the following command in your computer terminal:

```
npm install --save-dev protractor-cucumber-framework
```

Please note that to use `protractor-cucumber-framework` you'll need a recent [Long-Term Support](https://nodejs.org/en/about/releases/) versions of Node.js, so **16**, **18**, or **20**.

Odd-numbered Node.js releases (17, 19, 21, etc.) are not on the LTS line, should be considered experimental, and should
not be used in production.

## Upgrading from previous versions and backward compatibility

`protractor-cucumber-framework` is a thin wrapper around
[`@serenity-js/cucumber`](https://www.npmjs.com/package/@serenity-js/cucumber) and [`@serenity-js/protractor`](https://www.npmjs.com/package/@serenity-js/protractor) modules.

Just like Serenity/JS, this module:
- supports **all the major versions** of Cucumber.js,
- supports both Protractor v5 and v7,
- is backward compatible with previous major versions of `protractor-cucumber-framework`.

To stay up to date with the latest features, patches, and security fixes make sure to **always use the latest version** of `protractor-cucumber-framework` as this module offers **backward compatibility** with other dependencies, like  [`cucumber`](https://www.npmjs.com/package/cucumber), [`@cucumber/cucumber`](https://www.npmjs.com/package/@cucumber/cucumber), or [`protractor`](https://www.npmjs.com/package/protractor).

## Configuration

To use `protractor-cucumber-framework`, configure it as a `custom` framework
in your `protractor.conf.js`:

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
            'features/step_definitions/**/*.steps.js', // accepts a glob
            'features/support/*.ts',
        ]
    }
};
```

### Using TypeScript

Cucumber step definitions can be implemented in [TypeScript](https://www.typescriptlang.org/) and transpiled in memory
to JavaScript via [`ts-node`](https://github.com/TypeStrong/ts-node).

To use TypeScript, install the following dependencies:

```
npm install --save-dev typescript ts-node @types/node
```

Next, create a [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file in the root
directory of your project:

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "lib": [
      "ES2019"
    ],
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": false
  },
  "include": [
    "features/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

Finally, set the `cucumberOpts.requireModule` option in `protractor.conf.js` to `ts-node/register`
and configure Cucumber to load `.ts` files instead of `.js`:

```js
exports.config = {
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    specs: [
        'features/**/*.feature'
    ],

    cucumberOpts: {
        require: [
            'features/step_definitions/**/*.steps.ts',  // *.ts instead of *.js
            'features/support/*.ts',
        ],
        requireModule: [
            'ts-node/register'  // use ts-node to transpile TypeScript in memory
        ],
    },
};
```

You can now implement Cucumber step definitions in TypeScript, for example:

```typescript
// features/step_definitions/example.steps.ts
import { When, Then } from '@cucumber/cucumber'

When('developers like type safety', () => {
    
});

Then('they should use TypeScript', () => {

});
```

## Using Serenity/JS directly

Since `protractor-cucumber-framework` is just a thin wrapper around Serenity/JS modules,
you can depend on them directly to make sure you always get the latest and greatest features.

To configure your project to use Serenity/JS, remove the dependency on `protractor-cucumber-framework` and install the following dependencies instead:

```
npm install --save-dev @serenity-js/{core,cucumber,web,protractor}
```

Next, configure your `protractor.conf.js` file as follows:

```js
exports.config = {
    framework:      'custom',
    frameworkPath:  require.resolve('@serenity-js/protractor/adapter'),

    serenity: {
        runner: 'cucumber',
        crew: [
            // Serenity/JS reporting services
        ]
    },

    cucumberOpts: {
        // Cucumber config
    }
    
    // other Protractor config
};
```

### Using Serenity/JS reporting services

To use [Serenity/JS reporting services](https://serenity-js.org/handbook/reporting/index.html), configure your project to depend on Serenity/JS directly as per the previous section to make sure that your Serenity/JS dependencies are up-to-date and compatible. 

#### Using Serenity/JS console reporter

To use [Serenity/JS console reporter](https://serenity-js.org/handbook/reporting/console-reporter.html), install the following dependencies:
```
npm install --save-dev @serenity-js/{core,cucumber,web,protractor,console-reporter}
```

Next, configure your `protractor.conf.js` as follows:

```js
const { ConsoleReporter } = require('@serenity-js/console-reporter');

exports.config = {
    framework:      'custom',
    frameworkPath:  require.resolve('@serenity-js/protractor/adapter'),

    specs: [ 'features/**/*.feature' ],

    serenity: {
        runner: 'cucumber',
        crew: [
            ConsoleReporter.forDarkTerminals(),
        ]
    },
    
    // other config
};
```

#### Using Serenity BDD reporter

To use the [Serenity BDD reporter](https://serenity-js.org/handbook/reporting/serenity-bdd-reporter.html), install the following dependencies:

```
npm install --save-dev @serenity-js/{core,cucumber,web,protractor,serenity-bdd} npm-failsafe rimraf
```

Next, configure your `protractor.conf.js` as follows:

```js
const
    { ArtifactArchiver } = require('@serenity-js/core'),
    { SerenityBDDReporter } = require('@serenity-js/serenity-bdd');

exports.config = {
    framework:      'custom',
    frameworkPath:  require.resolve('@serenity-js/protractor/adapter'),

    serenity: {
        runner: 'cucumber',
        crew: [
            ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
            new SerenityBDDReporter(),
        ]
    },

    // other config
};
```

To automatically download the Serenity BDD reporter CLI when you install your Node modules, add the following [`postinstall` script](https://docs.npmjs.com/cli/v9/using-npm/scripts) to your `package.json` file:

```json
{
  "scripts": {
    "postinstall": "serenity-bdd update",
  } 
}
```
To generate Serenity BDD reports when you run your tests, configure your `test` script to invoke `serenity-bdd run` when your tests are finished:


```json
{
    "scripts": {
        "postinstall": "serenity-bdd update",
        "clean": "rimraf target",
        "test": "failsafe clean test:execute test:report",
        "test:execute": "protractor ./protractor.conf.js",
        "test:report": "serenity-bdd run --features ./features"
    }
}
```

### Configuring Cucumber

All of the `cucumberOpts` will be passed to `cucumberjs` as arguments.

For example, to call Cucumber with the `--strict` flag and to specify custom formatters:

```js
exports.config = {
    framework: 'custom',
    frameworkPath: require.resolve('@serenity-js/protractor/adapter'),

    specs: [
        'features/**/*.feature'
    ],
    
    cucumberOpts: {
        strict: true,
        format: [
            'progress', 
            'pretty:output.txt'
        ],
        // ...
    }
}
```

The following parameters have special behaviour:

* `require` - globs will be expanded to multiple `--require` arguments
* `rerun` - value is passed as an argument; for use with
  the [rerun feature](https://github.com/cucumber/cucumber-js/blob/master/features/rerun_formatter.feature)

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
to upgrade to at least protractor version 7.0.0 and add the following to your protractor conf...

```
  ignoreUncaughtExceptions: true
```

This allows cucumber to handle the exception and record it appropriately.

Contributing
------------

Pull requests are welcome. Commits should be generated using `npm run commit` command.

For Contributors
----------------
Ensure that the following dependencies are installed:

* Java Runtime Environment (JRE) 8 or newer
* Node.js LTS
* Google Chrome

Clone the github repository:

```
git clone https://github.com/protractor-cucumber-framework/protractor-cucumber-framework
cd protractor-cucumber-framework
npm install
```

#### Testing

```
npm test
```

## Your feedback matters!

Do you find Serenity/JS useful? Give it a ⭐ star on GitHub and rate it on Openbase!

[![GitHub stars](https://img.shields.io/github/stars/serenity-js/serenity-js)](https://github.com/serenity-js/serenity-js) [![Rate on Openbase](https://badges.openbase.io/js/rating/@serenity-js/core.svg)](https://openbase.io/js/@serenity-js/core?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

Found a bug? Need a feature? Raise [an issue](https://github.com/serenity-js/serenity-js/issues?state=open)
or submit a pull request.

Have feedback? Let me know on [LinkedIn](https://www.linkedin.com/in/janmolak/) or leave a comment in [Serenity/JS discussions on GitHub](/serenity-js/serenity-js/discussions/categories/comments)

If you'd like to chat with fellow users of Serenity/JS, join us on [Serenity/JS Community Chat](https://matrix.to/#/#serenity-js:gitter.im).

## Support Serenity/JS

Serenity/JS is a free open-source framework, so we rely on our [wonderful GitHub sponsors](https://github.com/sponsors/serenity-js) to keep the lights on.

If you appreciate all the effort that goes into making sophisticated tools easy to work with, please support our work and become a Serenity/JS GitHub Sponsor today!

[![GitHub Sponsors](https://img.shields.io/badge/Support%20@serenity%2FJS-703EC8?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/serenity-js)
