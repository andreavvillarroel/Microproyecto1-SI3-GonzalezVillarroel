// Variables
const colors = ["red", "green", "blue", "yellow"];
let sequence = [];
let playerSequence = [];
let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || {};

const colorButtons = document.querySelectorAll(".color-button");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-scores");
const scoreDisplay = document.getElementById("score");
const highScoresTable = document.querySelector("#high-scores table tbody");
const redSound = new Audio("redsound.mp3");
const greenSound = new Audio("greensound.mp3");
const blueSound = new Audio("bluesound.mp3");
const yellowSound = new Audio("yellowsound.mp3");
let playerName; 

// Funciones

function disabledstartbutton() {
  startButton.disabled = true;
  startButton.style.backgroundColor = "red";
  for (const color of colors) {
    const colorButton = document.getElementById(color);
    colorButton.style.display = "block";
  }
}

function enabledstartbutton() {
  startButton.disabled = false;
  startButton.style.backgroundColor = "#23c429";
  for (const color of colors) {
    const colorButton = document.getElementById(color);
    colorButton.style.display = "none";
  }
}

function startGame() {
  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.style.display = "none";
  sequence = [];
  playerSequence = [];
  score = 0;
  scoreDisplay.textContent = "Puntuación: " + score;
  disabledstartbutton();
  generateSequence();
  showSequence();
}

function generateSequence() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
}

function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = sequence[i];
    const button = document.getElementById(color);
    activateButton(button);
    switch (color) {
      case "red":
        redSound.play();
        break;
      case "green":
        greenSound.play();
        break;
      case "blue":
        blueSound.play();
        break;
      case "yellow":
        yellowSound.play();
        break;
    }

    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
    }
  }, 500);
}

function activateButton(button) {
  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
  }, 300);
  switch (button.id) {
    case "red":
        redSound.currentTime = 0;
        redSound.play();
        break;
    case "green":
        greenSound.currentTime = 0;
        greenSound.play();
        break;
    case "blue":
        blueSound.currentTime = 0;
        blueSound.play();
        break;
    case "yellow":
        yellowSound.currentTime = 0;
        yellowSound.play();
        break;
}
}

function handlePlayerInput(event) {
  const color = event.target.id;
  playerSequence.push(color);
  const playerIndex = playerSequence.length - 1;

  if (playerSequence[playerIndex] !== sequence[playerIndex]) {
    endGame();
    return;
  }

  if (playerSequence.length === sequence.length) {
    playerSequence = [];
    score++;
    scoreDisplay.textContent = "Puntuación: " + score;
    generateSequence();
    showSequence();
  }
}

function endGame() {
  const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.style.display = "block";

    gameOverMessage.querySelector("#final-score").textContent = score;

    // Verificar si el botón ya existe
    let changePlayerButton = document.getElementById("change-player-button");

    if (!changePlayerButton) { // Si no existe, se crea
        changePlayerButton = document.createElement("button");
        changePlayerButton.id = "change-player-button"; // Asignar ID al botón
        changePlayerButton.textContent = "Cambiar de Jugador";
        changePlayerButton.addEventListener("click", handlePlayerChange);
        gameOverMessage.appendChild(changePlayerButton);
    } // Si ya existe, no se hace nada

    updateHighScores();
    enabledstartbutton();
}

function updateHighScores() {
  highScores[playerName] = score; // Usar el nombre almacenado
  localStorage.setItem("highScores", JSON.stringify(highScores));
  renderHighScores();
}

function renderHighScores() {
  highScoresTable.innerHTML = "";
  const sortedScores = Object.entries(highScores).sort(([, a], [, b]) => b - a);
  sortedScores.forEach(([name, score]) => {
    const row = highScoresTable.insertRow();
    const nameCell = row.insertCell();
    const scoreCell = row.insertCell();
    nameCell.textContent = name;
    scoreCell.textContent = score;
  });
}

function resetGame() {
  localStorage.clear();
  highScores = JSON.parse(localStorage.getItem("highScores")) || {};
  renderHighScores();
  enabledstartbutton();
}

function handlePlayerChange() {
  playerName = prompt("Ingresa el nombre del nuevo jugador:");
  if (playerName === null || playerName.trim() === "") {
      playerName = "Jugador";
  }

  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.style.display = "none";
  gameOverMessage.removeChild(gameOverMessage.querySelector("button"));

  startGame();
}

// Eventos
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
colorButtons.forEach((button) => {
  button.addEventListener("click", handlePlayerInput);
});

// Inicialización

// Solicitar el nombre del jugador antes de iniciar el juego
playerName = prompt("Ingresa tu nombre:");
if (playerName === null || playerName.trim() === "") {
    playerName = "Jugador"; // Nombre por defecto si no ingresa nada o cancela
}

renderHighScores();