const fs = require('fs'),
  moduleRoot = 'test/multidep_modules',
  path = require('path'),
  cucumberConf = require(
    path.join(__dirname, '..', 'package.json'),
  ).cucumberConf,
  {spawnSync} = require('child_process');

// `multidep` hasn't been updated since 2017-01-09 and doesn't support namespaced packages like `@cucumber/cucumber`,
// or recursive directory.
// Because of those limitations, we need to create parent directories for our test packages ourselves:
Object.values(cucumberConf).forEach((conf) => {
  const pathToModule = path.join(
    __dirname,
    '..',
    moduleRoot,
    `${conf.module}-${conf.version}`,
  );

  if (!fs.existsSync(pathToModule)) {
    fs.mkdirSync(pathToModule, {recursive: true});
    fs.writeFileSync(
      path.join(pathToModule, '/package.json'),
      JSON.stringify(
        {
          name: `${conf.module}-dummy`,
          private: true,
          description: 'dummy',
          repository: 'https://example.com',
          license: 'MIT',
          dependencies: {
            [conf.module]: `${conf.version}`,
          },
        },
        null,
        4,
      ),
    );

    const result = spawnSync('npm', ['install'], {
      cwd: pathToModule,
      shell: true,
      stdio: 'inherit',
    });

    if (result.error || result.status !== 0) {
      console.error(result);
      process.exit(1);
    }
  }
});

const versionsGroupedByPackage = Object.values(cucumberConf).reduce(
  (acc, current) => {
    acc[current.module] = (acc[current.module] || []).concat(current.version);
    return acc;
  },
  {},
);

module.exports = {
  path: moduleRoot,
  versions: versionsGroupedByPackage,
};
