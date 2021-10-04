const
    fs = require('fs'),
    moduleRoot = 'test/multidep_modules',
    path = require('path'),
    cucumberConf = require(path.join(__dirname, '..', 'package.json')).cucumberConf;

// `multidep` hasn't been updated since 2017-01-09 and doesn't support namespaced packages like `@cucumber/cucumber`,
// or recursive directory.
// Because of those limitations, we need to create parent directories for our test packages ourselves:
Object.values(cucumberConf)
    .map(conf => path.join(__dirname, '..', moduleRoot, `${ conf.module }-${ conf.version }`))
    .forEach(pathToModule => {
        const parentDirectory = path.resolve(pathToModule, '..')
        if (!fs.existsSync(parentDirectory)) {
            console.log('Creating parent directory', parentDirectory)
            fs.mkdirSync(parentDirectory, { recursive: true });
        }
    });

const versionsGroupedByPackage = Object.values(cucumberConf)
    .reduce((acc, current) => {
        acc[current.module] = (acc[current.module] || []).concat(current.version)
        return acc;
    }, {});

module.exports = {
    path: moduleRoot,
    versions: versionsGroupedByPackage
};
