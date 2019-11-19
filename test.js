var assert = require('assert')

function test() {
  assert.equal(2 + 2, 5);
}

if (module == require.main) require('test').run(test);

