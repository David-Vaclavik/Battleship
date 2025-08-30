// const testFn = require("../modules/ship.js");
import { ship, testFn } from "../modules/ship.js";

test("adds 1 + 2 to equal 3", () => {
  expect(testFn(1, 2)).toBe(3);
});

describe("Ship tests", () => {
  test("creates a ship with given length", () => {
    const newShip = ship(5);
    expect(newShip.getLength()).toBe(5);
  });

  test("hits a ship", () => {
    const newShip = ship(3);
    newShip.hit();
    expect(newShip.getHits()).toBe(1);
  });

  test("sinks a ship", () => {
    const newShip = ship(2);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
  });
});
