function testFn(a, b) {
  return a + b;
}
module.exports = testFn;

// Your ‘ships’ will be objects that include their length, the number of hits
// and whether or not they’ve been sunk.
function ship() {
  let hits = 0;
  let length = 0;
  let sunk = false;

  return {
    // increases the number of ‘hits’ in your ship.
    hit() {
      return;
    },
  };
}
