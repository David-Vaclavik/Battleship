const testFn = require("../modules/ship.js");

test("adds 1 + 2 to equal 3", () => {
  expect(testFn(1, 2)).toBe(3);
});
