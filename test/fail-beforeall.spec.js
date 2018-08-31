let util = require('./test_util');

describe('Exit when cucumber fails to launch', function() {
  it('exit when sharded and cucumber fails to launch', function() {
    let cmd =
      'test/cucumber/conf/cucumber4ShardedFail.js --capabilities.shardTestFiles true';
    return util
      .runOne(cmd)
      .cucumberVersion4()
      .expectExitCode(100)
      .expectErrors(['BeforeAll hook errored'])
      .run();
  });
});
