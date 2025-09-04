import "./styles/styles.css";

// eslint-disable-next-line
import { player } from "./modules/player.js";
// eslint-disable-next-line
import { ship } from "./modules/ship.js";
// eslint-disable-next-line
import { gameboard } from "./modules/gameboard.js";
// eslint-disable-next-line
import { playGame, initEventListeners } from "./modules/dom.js";

playGame();
initEventListeners();
