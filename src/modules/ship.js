function testFn(a, b) {
  return a + b;
}

// Your ‘ships’ will be objects that include their length, the number of hits
// and whether or not they’ve been sunk.
function ship(length) {
  let hits = 0;

  return {
    hit() {
      if (this.isSunk()) return;
      hits += 1;
    },

    isSunk() {
      return hits >= length;
    },

    // getters for testing
    getHits() {
      return hits;
    },
    getLength() {
      return length;
    },
  };
}

export { ship, testFn };

/*
const cruiser = ship(3);
console.log(cruiser.isSunk()); // false
cruiser.hit();
console.log(cruiser.getHits()); // 1
console.log(cruiser.isSunk()); // false
cruiser.hit();
cruiser.hit();
console.log(cruiser.isSunk()); // true
console.log(cruiser.getHits()); // 3
cruiser.hit();
console.log(cruiser.getHits()); // 3
*/
