import { gameboard } from "../modules/gameboard.js";
import { ship } from "../modules/ship.js";
import { jest } from "@jest/globals";

describe("Gameboard", () => {
  let board;

  beforeEach(() => {
    board = gameboard();
  });

  describe("Board initialization", () => {
    test("creates a 10x10 board", () => {
      const gameBoard = board.getBoard();
      expect(gameBoard).toHaveLength(10);
      expect(gameBoard[0]).toHaveLength(10);
      expect(gameBoard[9]).toHaveLength(10);
    });

    test("initializes all cells with water objects", () => {
      const gameBoard = board.getBoard();
      gameBoard.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toEqual({ ship: null, hit: false });
        });
      });
    });
  });

  describe("Ship placement", () => {
    test("places ship horizontally (row)", () => {
      const testShip = ship(3);
      board.placeShip(testShip, 2, 2, "row");

      const gameBoard = board.getBoard();

      // Check ship is placed correctly
      expect(gameBoard[2][2]).toEqual({ ship: testShip, hit: false });
      expect(gameBoard[2][3]).toEqual({ ship: testShip, hit: false });
      expect(gameBoard[2][4]).toEqual({ ship: testShip, hit: false });

      // Check surrounding cells are still water
      expect(gameBoard[2][1]).toEqual({ ship: null, hit: false });
      expect(gameBoard[2][5]).toEqual({ ship: null, hit: false });
    });

    test("places ship vertically (column)", () => {
      const testShip = ship(2);
      board.placeShip(testShip, 3, 5, "column");

      const gameBoard = board.getBoard();

      // Check ship is placed correctly
      expect(gameBoard[3][5]).toEqual({ ship: testShip, hit: false });
      expect(gameBoard[4][5]).toEqual({ ship: testShip, hit: false });

      // Check surrounding cells are still water
      expect(gameBoard[2][5]).toEqual({ ship: null, hit: false });
      expect(gameBoard[5][5]).toEqual({ ship: null, hit: false });
    });

    test("defaults to row direction when no direction specified", () => {
      const testShip = ship(2);
      board.placeShip(testShip, 0, 0); // No direction parameter

      const gameBoard = board.getBoard();
      expect(gameBoard[0][0]).toEqual({ ship: testShip, hit: false });
      expect(gameBoard[0][1]).toEqual({ ship: testShip, hit: false });
    });
  });

  describe("Receive attacks", () => {
    test("handles attack on water (miss)", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      board.receiveAttack(0, 0);

      const gameBoard = board.getBoard();
      expect(gameBoard[0][0]).toEqual({ ship: null, hit: true }); // Miss marker
      expect(consoleSpy).toHaveBeenCalledWith("Attack missed");

      consoleSpy.mockRestore();
    });

    test("handles attack on ship (hit)", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const testShip = ship(2);

      board.placeShip(testShip, 1, 1, "row");
      board.receiveAttack(1, 1);

      const gameBoard = board.getBoard();
      expect(gameBoard[1][1]).toEqual({ ship: testShip, hit: true });
      expect(testShip.getHits()).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith("Attack Hit the ship");

      consoleSpy.mockRestore();
    });

    test("prevents attacking same spot twice", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // First attack
      board.receiveAttack(0, 0);
      expect(consoleSpy).toHaveBeenCalledWith("Attack missed");

      // Second attack on same spot
      board.receiveAttack(0, 0);
      expect(consoleSpy).toHaveBeenCalledWith("Already attacked spot, gameboard");

      const gameBoard = board.getBoard();
      expect(gameBoard[0][0]).toEqual({ ship: null, hit: true });

      consoleSpy.mockRestore();
    });

    test("prevents attacking same ship spot twice", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const testShip = ship(2);

      board.placeShip(testShip, 1, 1, "row");

      // First attack
      board.receiveAttack(1, 1);
      expect(consoleSpy).toHaveBeenCalledWith("Attack Hit the ship");
      expect(testShip.getHits()).toBe(1);

      // Second attack on same spot
      board.receiveAttack(1, 1);
      expect(consoleSpy).toHaveBeenCalledWith("Already attacked spot, gameboard");
      expect(testShip.getHits()).toBe(1); // Should not increase

      consoleSpy.mockRestore();
    });

    test("tracks multiple hits on same ship", () => {
      const testShip = ship(3);
      board.placeShip(testShip, 2, 2, "column");

      // Hit the ship multiple times
      board.receiveAttack(2, 2);
      board.receiveAttack(3, 2);
      board.receiveAttack(4, 2);

      expect(testShip.getHits()).toBe(3);
      expect(testShip.isSunk()).toBe(true);
    });

    test("returns updated board after attack", () => {
      const result = board.receiveAttack(0, 0);
      expect(result).toBe(board.getBoard());
      expect(result[0][0]).toEqual({ ship: null, hit: true });
    });
  });

  describe("Board display", () => {
    test("getBoardDisplay returns formatted string", () => {
      const testShip = ship(2);
      board.placeShip(testShip, 0, 0, "row");
      board.receiveAttack(0, 0); // Hit ship
      board.receiveAttack(1, 1); // Miss

      const display = board.getBoardDisplay(true);

      expect(typeof display).toBe("string");
      expect(display).toContain("0 1 2 3 4 5 6 7 8 9");
      // expect(display).toContain("Legend:");
      expect(display).toContain("X"); // Hit ship
      expect(display).toContain("S"); // Ship
      expect(display).toContain("O"); // Miss
    });

    test("getBoardDisplay hides ships when showShips is false", () => {
      const testShip = ship(2);
      board.placeShip(testShip, 0, 0, "row");

      const hiddenDisplay = board.getBoardDisplay(false);
      const visibleDisplay = board.getBoardDisplay(true);

      expect(hiddenDisplay).not.toContain("S");
      expect(visibleDisplay).toContain("S");
    });

    test("printBoard calls console.log", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      board.printBoard();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Game winner check", () => {
    test("returns false when ships are not sunk", () => {
      const testShip = ship(2);
      board.placeShip(testShip, 0, 0, "row");

      expect(board.checkWinner()).toBe(false);
    });

    test("returns false when ship is partially hit", () => {
      const testShip = ship(3);
      board.placeShip(testShip, 1, 1, "row");

      board.receiveAttack(1, 1); // Hit once
      board.receiveAttack(1, 2); // Hit twice

      expect(testShip.getHits()).toBe(2);
      expect(testShip.isSunk()).toBe(false);
      expect(board.checkWinner()).toBe(false);
    });

    test("returns true when all ships are sunk", () => {
      const ship1 = ship(2);
      const ship2 = ship(1);

      board.placeShip(ship1, 0, 0, "row");
      board.placeShip(ship2, 2, 2);

      // Sink first ship
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 1);

      // Sink second ship
      board.receiveAttack(2, 2);

      expect(ship1.isSunk()).toBe(true);
      expect(ship2.isSunk()).toBe(true);
      expect(board.checkWinner()).toBe(true);
    });

    test("returns true when no ships are placed (empty board)", () => {
      expect(board.checkWinner()).toBe(true);
    });

    test("ignores missed attacks when checking winner", () => {
      const testShip = ship(1);
      board.placeShip(testShip, 5, 5);

      // Miss some attacks
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 1);
      board.receiveAttack(9, 9);

      // Sink the ship
      board.receiveAttack(5, 5);

      expect(board.checkWinner()).toBe(true);
    });
  });

  describe("Multiple ships scenario", () => {
    test("handles multiple ships of different sizes", () => {
      const destroyer = ship(2);
      const cruiser = ship(3);
      const battleship = ship(4);

      board.placeShip(destroyer, 0, 0, "row");
      board.placeShip(cruiser, 2, 2, "column");
      board.placeShip(battleship, 5, 1, "row");

      // Verify all ships are placed
      const gameBoard = board.getBoard();
      expect(gameBoard[0][0].ship).toBe(destroyer);
      expect(gameBoard[2][2].ship).toBe(cruiser);
      expect(gameBoard[5][1].ship).toBe(battleship);

      expect(board.checkWinner()).toBe(false);
    });

    test("requires all ships to be sunk to win", () => {
      const ship1 = ship(2);
      const ship2 = ship(2);

      board.placeShip(ship1, 0, 0, "row");
      board.placeShip(ship2, 3, 3, "column");

      // Sink only first ship
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 1);
      expect(ship1.isSunk()).toBe(true);
      expect(board.checkWinner()).toBe(false);

      // Sink second ship
      board.receiveAttack(3, 3);
      board.receiveAttack(4, 3);
      expect(ship2.isSunk()).toBe(true);
      expect(board.checkWinner()).toBe(true);
    });
  });
});
