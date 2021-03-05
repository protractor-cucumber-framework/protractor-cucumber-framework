const { serenity } = require('@serenity-js/core');
const { Path } = require('@serenity-js/core/lib/io');
const {
    ProtractorFrameworkAdapter,
    TestRunnerDetector,
    TestRunnerLoader
} = require('@serenity-js/protractor/lib/adapter');

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {string[]} specs Array of Directory Path Strings.
 * @return {Promise<void>>} Promise resolved with the test results
 */
exports.run = function (runner, specs) {
    return new ProtractorFrameworkAdapter(
        serenity,
        runner,
        new TestRunnerDetector(new TestRunnerLoader(
            testModeOrDefaultCwd(runner.getConfig().configDir),
            process.pid
        ))
    ).run(specs);
}

function testModeOrDefaultCwd(defaulValue) {
    if (! process.env.MULTIDEP_CUCUMBER_CONF) {
        return Path.from(defaulValue);
    }

    // protractor-framework-adapter running in self-test mode
    const cucumberConf = JSON.parse(process.env.MULTIDEP_CUCUMBER_CONF);
    return Path.from(
        __dirname,
        `test/multidep_modules/${ cucumberConf.module }-${ cucumberConf.version }`
    );
}
