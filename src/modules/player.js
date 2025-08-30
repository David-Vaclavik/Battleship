import { gameboard } from "./gameboard.js";
// eslint-disable-next-line
import { ship } from "./ship.js";

function player(type) {
  // each player gets their own gameboard
  const board = gameboard();

  return {
    getOnlyBoard() {
      board.printBoard(true);
    },
    getInstance() {
      return board;
    },
    getType() {
      return type;
    },
    makeAttack(opponentBoard, x, y) {
      const randomX = Math.floor(Math.random() * 10);
      const randomY = Math.floor(Math.random() * 10);

      // The ?? is - nullish coalescing operator, if left side is null / undefined use right side
      // Means: "Use x if it exists, otherwise use randomX"
      let attackX = x ?? randomX;
      let attackY = y ?? randomY;

      // Check if spot already attacked before making attack
      const board = opponentBoard.getBoard();
      if (board[attackX][attackY].hit === true) {
        while (board[attackX][attackY].hit === true) {
          console.log(`Already attacked spot at (${attackX}, ${attackY})`);
          attackX = Math.floor(Math.random() * 10);
          attackY = Math.floor(Math.random() * 10);
        }
      }

      //? Check for winner after each attack

      return opponentBoard.receiveAttack(attackX, attackY);
    },
  };
}

export { player };

console.log("--------- Player ---------");
const P1 = player("real");
const P2 = player("clanker");

console.log(P1.getType());
// P1.receiveAttack(4, 2);

// Place ships
// const ship1 = ship(2);
// P2.getInstance().placeShip(ship1, 0, 0);

// let cords = Math.floor(Math.random() * 10);

console.log("--------- Attack ---------");
// P1.makeAttack(P2.getInstance());
P1.makeAttack(P2.getInstance(), 2, 3);
P1.makeAttack(P2.getInstance(), 2, 3);
// P1.makeAttack(P2.getInstance(), 2, 3);

// for (let i = 0; i < 10; i++) {
//   let attack = P1.makeAttack(P2.getInstance());
//   if (!attack) i--;
// }

// P1.makeAttack(cords, cords, P2.getInstance());
// P1.makeAttack(0, 0, P2.getInstance());

console.log("--------- Player 1 ---------");
// console.table(P1.getOnlyBoard());
// P1.getOnlyBoard();

console.log("--------- Player 2 ---------");
// console.table(P2.getOnlyBoard());
// console.log(P2.getOnlyBoard());
P2.getOnlyBoard();

// console.log(cords);
