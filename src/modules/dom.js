import { player } from "../modules/player.js";
import { ship } from "../modules/ship.js";
// eslint-disable-next-line
import { gameboard } from "./gameboard.js";

// Global game state
let gameState = null;

// Game controller logic
function playGame() {
  const P1 = player("human");
  const P2 = player("computer");

  //? maybe should be in ships?
  // Create fleet: 1×4, 2×3, 3×2, 4×1
  function createFleet() {
    return [
      ship(4), // 1× Battleship (4)
      ship(3),
      ship(3), // 2× Cruiser (3)
      ship(2),
      ship(2),
      ship(2), // 3× Destroyer (2)
      ship(1),
      ship(1),
      ship(1),
      ship(1), // 4× Patrol Boat (1)
    ];
  }

  //TODO: add random placement of ships
  randomPlacement(P1.getInstance());

  // Place ships for Player 1 (human)
  // const p1Fleet = createFleet();
  // P1.getInstance().placeShip(p1Fleet[0], 0, 0, "row"); // Battleship(4)
  // P1.getInstance().placeShip(p1Fleet[1], 2, 1, "column"); // Cruiser(3)
  // P1.getInstance().placeShip(p1Fleet[2], 4, 3, "row"); // Cruiser(3)
  // P1.getInstance().placeShip(p1Fleet[3], 6, 0, "column"); // Destroyer(2)
  // P1.getInstance().placeShip(p1Fleet[4], 8, 2, "row"); // Destroyer(2)
  // P1.getInstance().placeShip(p1Fleet[5], 6, 5, "column"); // Destroyer(2)
  // P1.getInstance().placeShip(p1Fleet[6], 0, 6, "row"); // Patrol(1)
  // P1.getInstance().placeShip(p1Fleet[7], 2, 8, "column"); // Patrol(1)
  // P1.getInstance().placeShip(p1Fleet[8], 5, 7, "row"); // Patrol(1)
  // P1.getInstance().placeShip(p1Fleet[9], 9, 9, "column"); // Patrol(1)

  // Place ships for Player 2 (computer)
  const p2Fleet = createFleet();
  P2.getInstance().placeShip(p2Fleet[0], 1, 2, "column"); // Battleship(4)
  P2.getInstance().placeShip(p2Fleet[1], 3, 6, "row"); // Cruiser(3)
  P2.getInstance().placeShip(p2Fleet[2], 6, 2, "column"); // Cruiser(3)
  P2.getInstance().placeShip(p2Fleet[3], 0, 7, "row"); // Destroyer(2)
  P2.getInstance().placeShip(p2Fleet[4], 8, 0, "column"); // Destroyer(2)
  P2.getInstance().placeShip(p2Fleet[5], 5, 8, "row"); // Destroyer(2)
  P2.getInstance().placeShip(p2Fleet[6], 0, 0, "column"); // Patrol(1)
  P2.getInstance().placeShip(p2Fleet[7], 2, 0, "row"); // Patrol(1)
  P2.getInstance().placeShip(p2Fleet[8], 7, 5, "column"); // Patrol(1)
  P2.getInstance().placeShip(p2Fleet[9], 9, 4, "row"); // Patrol(1)

  // console.log(P1.getInstance().getBoard());
  //TODO: Add the coords numbers
  const app = document.querySelector(".app");
  app.textContent = "";

  for (let a = 0; a < 2; a++) {
    const bool = a === 0 ? false : true;

    const div = document.createElement("div");
    div.className = "gameboard-container";
    div.setAttribute("data-enemy-board", bool);
    app.appendChild(div);

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const button = document.createElement("button");
        button.className = "cell";
        button.dataset.row = i;
        button.dataset.col = j;
        div.appendChild(button);
      }
    }
  }

  showMyShips(P1.getInstance().getBoard());

  // Store game state globally
  gameState = {
    P1,
    P2,
    currentPlayer: P1,
    opponent: P2,
    turnCount: 0,
    gameOver: false,
  };

  console.log(
    "Game started with fleet: 1xBattleship(4), 2xCruiser(3), 3xDestroyer(2), 4xPatrol(1)"
  );
  console.log("Total: 10 ships, 20 cells occupied");

  return gameState;
}

function randomPlacement(player) {
  function createFleet() {
    return [
      ship(4), // 1× Battleship (4)
      ship(3),
      ship(3), // 2× Cruiser (3)
      ship(2),
      ship(2),
      ship(2), // 3× Destroyer (2)
      ship(1),
      ship(1),
      ship(1),
      ship(1), // 4× Patrol Boat (1)
    ];
  }

  const fleet = createFleet();

  for (let i = 0; i < 10; i++) {
    const direction = Math.random() < 0.5 ? "row" : "column";
    const placeX = Math.floor(Math.random() * 10);
    const placeY = Math.floor(Math.random() * 10);

    const currentShip = fleet[i];

    const valid = player.isValidPlacement(currentShip, placeX, placeY, direction);
    if (!valid) {
      console.log("ship spotted");
      i--;
      continue;
    }

    player.placeShip(currentShip, placeX, placeY, direction);
  }
}

//! maybe not needed? was for testing
function playTurn() {
  if (!gameState || gameState.gameOver) return;

  const { currentPlayer, opponent } = gameState;
  gameState.turnCount++;

  console.log(`\n--- Turn ${gameState.turnCount}: ${currentPlayer.getType()} attacks ---`);

  // Make attack
  currentPlayer.makeAttack(opponent.getInstance());

  // Show current board state
  console.log(`${opponent.getType()}'s board:`);
  opponent.getOnlyBoard();

  // Check if game is over
  if (opponent.getInstance().checkWinner()) {
    console.log(`\n🎉 ${currentPlayer.getType()} wins!`);
    gameState.gameOver = true;
    return;
  }

  [gameState.currentPlayer, gameState.opponent] = [gameState.opponent, gameState.currentPlayer];
}

function resetGame() {
  console.log("Game reset");
  playGame();
}

// Event delegation
function initEventListeners() {
  const app = document.querySelector(".app");
  const body = document.body;

  app.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;

    handleCellClick(e);
  });

  body.addEventListener("click", (e) => {
    if (e.target.matches("[data-reset]")) {
      console.log("reset pressed");
      resetGame();
    } else if (e.target.matches("[data-play]")) {
      console.log("Play turn button pressed");
      playTurn();
    } else if (e.target.matches("[data-random]")) {
      console.log("random btn");

      if (gameState.turnCount > 0) {
        console.log("can't place ships during game");
      } else {
        resetGame();
      }
    }
  });
}

function handleCellClick(e) {
  if (!gameState || gameState.gameOver) {
    console.log("No active game or game over");
    return;
  }

  const target = e.target;

  if (target.disabled) {
    console.log("Cell already attacked!");
    return;
  }

  // Only allow clicks on enemy board (human attacking computer)
  const isEnemyBoard = target.closest('[data-enemy-board="true"]');
  if (!isEnemyBoard) {
    console.log("Can't attack your own board!");
    return;
  }

  gameState.turnCount++;
  // console.log(gameState.turnCount);

  const { currentPlayer, opponent } = gameState;
  const row = parseInt(target.dataset.row);
  const col = parseInt(target.dataset.col);

  console.log(`Clicked cell at (${row}, ${col})`);

  // Make attack
  const attack = currentPlayer.makeAttack(opponent.getInstance(), row, col);
  const attackedCell = attack[row][col];

  if (!attackedCell.ship) {
    target.dataset.state = "miss";
    target.textContent = "O";
    target.disabled = true;
  } else {
    target.dataset.state = "hit";
    target.textContent = "X";
    target.disabled = true;

    if (attackedCell.ship.isSunk()) {
      target.dataset.state = "sunk";
      console.log("Ship sunk!");
      markSunkShipCells(attack, attackedCell.ship);
    }
  }

  // Check if human won
  if (opponent.getInstance().checkWinner()) {
    console.log(`🎉 ${currentPlayer.getType()} wins!`);
    gameState.gameOver = true;
    return;
  }

  [gameState.currentPlayer, gameState.opponent] = [gameState.opponent, gameState.currentPlayer];

  if (gameState.currentPlayer.getType() === "computer") {
    makeComputerMove();
  }
}

function makeComputerMove() {
  if (!gameState || gameState.gameOver) return;

  const { currentPlayer, opponent } = gameState;

  if (currentPlayer.getType() !== "computer") return;

  gameState.turnCount++;
  // console.log("Computer is thinking...");

  setTimeout(() => {
    const attack = currentPlayer.makeAttack(opponent.getInstance());
    updatePlayerBoard(attack);

    if (opponent.getInstance().checkWinner()) {
      console.log(`🎉 ${currentPlayer.getType()} wins!`);
      gameState.gameOver = true;
      return;
    }

    [gameState.currentPlayer, gameState.opponent] = [gameState.opponent, gameState.currentPlayer];
    // console.log("Your turn!");
  }, 10);
}

function updatePlayerBoard(board) {
  const boardSelector = '[data-enemy-board="false"]';

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.querySelector(
        `${boardSelector} [data-row="${rowIndex}"][data-col="${colIndex}"]`
      );

      if (cellElement && cell.hit) {
        if (cell.ship) {
          cellElement.dataset.state = "hit";
          cellElement.textContent = "X";
          cellElement.disabled = true;

          if (cell.ship.isSunk()) {
            markSunkShipCells(board, cell.ship);
          }
        } else {
          cellElement.dataset.state = "miss";
          cellElement.textContent = "O";
          cellElement.disabled = true;
        }
      }
    });
  });
}

function markSunkShipCells(board, sunkShip) {
  const isPlayerBoard = gameState.currentPlayer.getType() === "computer";
  const boardSelector = isPlayerBoard ? '[data-enemy-board="false"]' : '[data-enemy-board="true"]';

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.ship === sunkShip) {
        const cellElement = document.querySelector(
          `${boardSelector} [data-row="${rowIndex}"][data-col="${colIndex}"]`
        );
        if (cellElement) {
          cellElement.dataset.state = "sunk";
          cellElement.disabled = true;
        }
      }
    });
  });
}

function showMyShips(board) {
  const boardSelector = '[data-enemy-board="false"]';

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.ship) {
        const cellElement = document.querySelector(
          `${boardSelector} [data-row="${rowIndex}"][data-col="${colIndex}"]`
        );
        if (cellElement) {
          cellElement.dataset.state = "ship";
        }
      }
    });
  });
}

export { playGame, playTurn, initEventListeners };
