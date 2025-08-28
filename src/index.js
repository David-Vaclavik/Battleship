import "./styles/styles.css";
import { homepage } from "./modules/homepage.js";

const homeButton = document.querySelector("[data-home]");

homepage();

homeButton.addEventListener("click", () => {
  homepage();
});

// Error below for ESLint
// var x = ; // This is a syntax error and ESLint will report it
