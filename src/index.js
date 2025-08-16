import "./index.css";
import "./mote/main.js"
import initGame from "./app.js"

window.gameState = localStorage.getItem("game") || {
  garden: {
    cost: 0
  },
  buildings: {},
  modifiers: {},
  balance: 0,
}

document.querySelector("#root").append(initGame())