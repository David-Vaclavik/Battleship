// eslint-disable-next-line
import { ship } from "./ship.js";
// eslint-disable-next-line
import util from "util";

function gameboard() {
  let board = [];
  for (let i = 0; i < 10; i++) {
    board.push([]);
    for (let j = 0; j < 10; j++) {
      // board[i].push("-");
      board[i].push({ ship: null, hit: false }); // water cell
    }
  }

  //* maybe water should be: { ship: null, hit: false }

  return {
    getBoard() {
      return board;
    },

    getBoardDisplay(showShips = true) {
      let output = "    0 1 2 3 4 5 6 7 8 9\n";
      output += "  ┌─────────────────────┐\n";

      board.forEach((row, i) => {
        const formattedRow = row
          .map((cell) => {
            // Hit ship
            if (cell.ship && cell.hit) return "X";
            // Missed attack
            if (!cell.ship && cell.hit) return "O";
            // Ship (only show if showShips is true)
            if (cell.ship && !cell.hit) return showShips ? "S" : "~";
            // Water
            return "~";
          })
          .join(" ");

        output += `${i} │ ${formattedRow} │\n`;
      });

      output += "  └─────────────────────┘\n";
      // output += "Legend: ~ = Water, S = Ship, X = Hit, O = Miss";

      return output;
    },

    // Convenience method
    printBoard(showShips = true) {
      console.log(this.getBoardDisplay(showShips));
    },

    receiveAttack(x, y) {
      if (board[x][y].hit === true) {
        console.log("Already attacked spot, gameboard");
        return false;
      }

      if (board[x][y].hit === false && board[x][y].ship === null) {
        console.log("Attack missed");
        board[x][y].hit = true;
      } else if (board[x][y].ship) {
        console.log("Attack Hit the ship");
        board[x][y].ship.hit();
        board[x][y].hit = true;
      }

      return board;
    },

    placeShip(ship, x, y, direction = "row") {
      if (direction === "row") {
        for (let i = 0; i < ship.getLength(); i++) {
          board[x][y + i] = { ship, hit: false };
        }
      } else if (direction === "column") {
        for (let i = 0; i < ship.getLength(); i++) {
          board[x + i][y] = { ship, hit: false };
        }
      }

      return board;
    },

    checkWinner() {
      return board.flat().every((cell) => !cell.ship || cell.ship.isSunk());
    },

    // isValidPlacement(ship, x, y, direction) {
    //   return
    // },
  };
}

export { gameboard };

/*
const bo = gameboard();

console.log(
  util.inspect(bo.getBoard(), {
    compact: true,
  })
);

console.log("--------- Attack ---------");
console.log(util.inspect(bo.receiveAttack(0, 0), { compact: true }));

const cruiser = ship(3);

console.log("--------- Place Ship ---------");
console.log(util.inspect(bo.placeShip(cruiser, 2, 2, "column"), { compact: true }));

bo.receiveAttack(2, 2);
console.log(cruiser.getHits()); // 1
bo.receiveAttack(3, 2);
bo.receiveAttack(4, 2);
console.table(bo.getBoard());
console.log(cruiser.getHits()); // 3
console.log(cruiser.isSunk()); // true

console.log(bo.checkWinner());
*/
/*
const bo = gameboard();
bo.receiveAttack(0, 0);
// console.log(util.inspect(bo.receiveAttack(0, 0), { compact: true }));
// console.log(util.inspect(bo.receiveAttack(0, 0), { compact: true }));

console.log("--------- Place Ship ---------");
const cruiser = ship(3);
bo.placeShip(cruiser, 2, 2, "column");
// console.log(util.inspect(bo.placeShip(cruiser, 2, 2, "column"), { compact: true }));

console.log("--------- Attack ---------");
bo.receiveAttack(2, 2);
bo.receiveAttack(2, 2);
// console.clear(); // Clears the console

console.log("Your Board:");
bo.printBoard(true);
*/
