// src/tests/player.test.js
import { player } from "../modules/player.js";
import { ship } from "../modules/ship.js";
import { jest } from "@jest/globals";

describe("Player", () => {
  let player1;
  let player2;

  beforeEach(() => {
    player1 = player("human");
    player2 = player("computer");
  });

  describe("Player initialization", () => {
    test("creates player with correct type", () => {
      expect(player1.getType()).toBe("human");
      expect(player2.getType()).toBe("computer");
    });

    test("each player gets their own gameboard", () => {
      const board1 = player1.getInstance();
      const board2 = player2.getInstance();

      expect(board1).not.toBe(board2);
      expect(board1.getBoard()).not.toBe(board2.getBoard());
    });

    test("player board is initially empty", () => {
      const board = player1.getInstance().getBoard();

      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toEqual({ ship: null, hit: false });
        });
      });
    });
  });

  describe("getOnlyBoard method", () => {
    test("prints board without returning value", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const result = player1.getOnlyBoard();

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("getInstance method", () => {
    test("returns the player's gameboard instance", () => {
      const instance = player1.getInstance();

      expect(instance).toBeDefined();
      expect(typeof instance.getBoard).toBe("function");
      expect(typeof instance.receiveAttack).toBe("function");
      expect(typeof instance.placeShip).toBe("function");
    });
  });

  describe("makeAttack method", () => {
    beforeEach(() => {
      // Place a ship for testing hits
      const testShip = ship(3);
      player2.getInstance().placeShip(testShip, 1, 1, "row");
    });

    test("attacks specific coordinates when provided", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      player1.makeAttack(player2.getInstance(), 0, 0);

      const opponentBoard = player2.getInstance().getBoard();
      expect(opponentBoard[0][0].hit).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith("Attack missed");

      consoleSpy.mockRestore();
    });

    test("attacks random coordinates when none provided", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      player1.makeAttack(player2.getInstance());

      const opponentBoard = player2.getInstance().getBoard();
      const hitCells = opponentBoard.flat().filter((cell) => cell.hit === true);

      expect(hitCells).toHaveLength(1);

      consoleSpy.mockRestore();
    });

    test("hits ship when attacking ship coordinates", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      player1.makeAttack(player2.getInstance(), 1, 1);

      const opponentBoard = player2.getInstance().getBoard();
      expect(opponentBoard[1][1].hit).toBe(true);
      expect(opponentBoard[1][1].ship).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith("Attack Hit the ship");

      consoleSpy.mockRestore();
    });

    test("handles duplicate attack attempts", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // First attack
      player1.makeAttack(player2.getInstance(), 0, 0);
      expect(consoleSpy).toHaveBeenCalledWith("Attack missed");

      // Second attack on same spot
      player1.makeAttack(player2.getInstance(), 0, 0);
      expect(consoleSpy).toHaveBeenCalledWith("Already attacked spot at (0, 0)");

      // Should find a new spot and attack it
      const opponentBoard = player2.getInstance().getBoard();
      const hitCells = opponentBoard.flat().filter((cell) => cell.hit === true);
      expect(hitCells.length).toBeGreaterThan(1);

      consoleSpy.mockRestore();
    });

    test("finds new random coordinates when duplicate detected", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Attack same spot twice
      player1.makeAttack(player2.getInstance(), 5, 5);
      player1.makeAttack(player2.getInstance(), 5, 5);

      const opponentBoard = player2.getInstance().getBoard();
      const hitCells = opponentBoard.flat().filter((cell) => cell.hit === true);

      // Should have 2 hit cells (original + new random spot)
      expect(hitCells).toHaveLength(2);
      expect(opponentBoard[5][5].hit).toBe(true);

      consoleSpy.mockRestore();
    });

    test("returns the updated board after attack", () => {
      const result = player1.makeAttack(player2.getInstance(), 3, 3);
      const expectedBoard = player2.getInstance().getBoard();

      expect(result).toBe(expectedBoard);
      expect(result[3][3].hit).toBe(true);
    });

    test("uses nullish coalescing correctly", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Test with x provided, y undefined
      player1.makeAttack(player2.getInstance(), 2, undefined);

      const opponentBoard = player2.getInstance().getBoard();
      expect(
        opponentBoard[2][0].hit ||
          opponentBoard[2][1].hit ||
          opponentBoard[2][2].hit ||
          opponentBoard[2][3].hit ||
          opponentBoard[2][4].hit ||
          opponentBoard[2][5].hit ||
          opponentBoard[2][6].hit ||
          opponentBoard[2][7].hit ||
          opponentBoard[2][8].hit ||
          opponentBoard[2][9].hit
      ).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("Player interaction", () => {
    test("players can attack each other's boards", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Player 1 attacks Player 2
      player1.makeAttack(player2.getInstance(), 0, 0);

      // Player 2 attacks Player 1
      player2.makeAttack(player1.getInstance(), 1, 1);

      const board1 = player1.getInstance().getBoard();
      const board2 = player2.getInstance().getBoard();

      expect(board1[1][1].hit).toBe(true);
      expect(board2[0][0].hit).toBe(true);

      consoleSpy.mockRestore();
    });

    test("players maintain separate board states", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Place ships on both players
      const ship1 = ship(2);
      const ship2 = ship(3);

      player1.getInstance().placeShip(ship1, 0, 0, "row");
      player2.getInstance().placeShip(ship2, 5, 5, "column");

      // Attack each other
      player1.makeAttack(player2.getInstance(), 5, 5);
      player2.makeAttack(player1.getInstance(), 0, 0);

      const board1 = player1.getInstance().getBoard();
      const board2 = player2.getInstance().getBoard();

      // Player 1's ship should be hit
      expect(board1[0][0].hit).toBe(true);
      expect(board1[0][0].ship).toBe(ship1);

      // Player 2's ship should be hit
      expect(board2[5][5].hit).toBe(true);
      expect(board2[5][5].ship).toBe(ship2);

      // Other positions should not be affected
      expect(board1[5][5].hit).toBe(false);
      expect(board2[0][0].hit).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe("Edge cases", () => {
    test("handles attacks at board boundaries", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Attack corners and edges
      player1.makeAttack(player2.getInstance(), 0, 0); // Top-left
      player1.makeAttack(player2.getInstance(), 0, 9); // Top-right
      player1.makeAttack(player2.getInstance(), 9, 0); // Bottom-left
      player1.makeAttack(player2.getInstance(), 9, 9); // Bottom-right

      const opponentBoard = player2.getInstance().getBoard();
      expect(opponentBoard[0][0].hit).toBe(true);
      expect(opponentBoard[0][9].hit).toBe(true);
      expect(opponentBoard[9][0].hit).toBe(true);
      expect(opponentBoard[9][9].hit).toBe(true);

      consoleSpy.mockRestore();
    });

    test("works with multiple ship placements", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Place multiple ships
      const destroyer = ship(2);
      const cruiser = ship(3);
      const battleship = ship(4);

      player2.getInstance().placeShip(destroyer, 0, 0, "row");
      player2.getInstance().placeShip(cruiser, 2, 2, "column");
      player2.getInstance().placeShip(battleship, 5, 1, "row");

      // Attack different ships
      player1.makeAttack(player2.getInstance(), 0, 0); // Hit destroyer
      player1.makeAttack(player2.getInstance(), 2, 2); // Hit cruiser
      player1.makeAttack(player2.getInstance(), 5, 1); // Hit battleship

      const opponentBoard = player2.getInstance().getBoard();
      expect(opponentBoard[0][0].ship).toBe(destroyer);
      expect(opponentBoard[2][2].ship).toBe(cruiser);
      expect(opponentBoard[5][1].ship).toBe(battleship);

      expect(destroyer.getHits()).toBe(1);
      expect(cruiser.getHits()).toBe(1);
      expect(battleship.getHits()).toBe(1);

      consoleSpy.mockRestore();
    });
  });
});
